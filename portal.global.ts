import { defineNuxtRouteMiddleware, useNuxtApp } from '#app'
import { ref } from 'vue'

export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const listApps = ref([])

  const isValidUrl = (baseApi: string | URL) => {
    try {
      return Boolean(new URL(baseApi))
    } catch (e) {
      return false
    }
  }

  const portalValidUrl = (baseApi: string) => {
    return (isValidUrl(baseApi)) ? baseApi : window.location.protocol + '//' + window.location.host + baseApi
  }

  const portalUrl = portalValidUrl(config.public.ePortalUrl)
  const portalApiUrl = portalValidUrl(config.ePortalApiUrl)

  const logout = async () => {
    await useAuth().logout()
    window.location.href = portalUrl + '/logout?service=' + config.public.baseUrl
  }

  try {
    useAuth().$storage.setState(
      'app.default_name',
      config.public.appName
    )
    useAuth().$storage.removeState('sessions_key')

    const sessionsKey = useCookie('portal.session', {
      sameSite: true,
      path: config.public.baseUrl
    })

    if (!sessionsKey.value) {
      if (!route.query.session_key) {
        window.location.href = portalUrl + '/visitordirect?token=' + config.public.portalToken
      } else {
        sessionsKey.value = route.query.session_key
      }
    }
    const responseSession = await $fetch('/api/auth/session',
      {
        baseURL: portalApiUrl,
        params: {
          sessions_key: sessionsKey.value
        }
      }
    )
    // console.log(responseSession)
    if (responseSession.data.session) {
      useAuth().$storage.setState('sessions_key', sessionsKey.value)
      if (!useAuth().$state.loggedIn) {
        const responseUserPortal = await $fetch('/api/auth/me',
          {
            baseURL: portalApiUrl,
            headers: {
              Authorization:
                'Bearer ' + responseSession.data.session.bearer_token
            }
          }
        )
        // console.log(responseUserses)
        if (responseUserPortal.status) {
          const loginResponse = await useAuth().loginWith('local', {
            body: {
              username: responseUserPortal.data.user.username,
              cherry_token: responseUserPortal.data.user.cherry_token,
              sessions_key: sessionsKey.value,
              language: 'en',
              app_name: config.public.appName
            }
          })

          if (!loginResponse.data.token) {
            alert(loginResponse.data.message)
          } else {
            const responseSession = await $fetch('/api/auth/session', {
              method: 'get',
              baseURL: config.public.baseApi,
              params: {
                sessions_key: sessionsKey.value,
                token: config.public.portalToken
              }
            })
            if (responseSession.data.status === true) {
              listApps.value = responseSession.data.list_app
              window.location = config.public.baseUrl
              if (!responseSession.data.app) {
                // window.location.href = process.env.eportalUrl
              }
            } else {
              await logout()
            }
          }
        }
      }
    } else {
      window.location.href = portalUrl + '/login?service=' + config.public.baseUrl
    }
  } catch (error: any) {
    console.log(error.data)
    setTimeout(() => {
      if (error.data) {
        alert(error.data.message)
        window.location.href = portalUrl + '/login?service=' + config.public.baseUrl
      }
    }, 500)
  }
})
