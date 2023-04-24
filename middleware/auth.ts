import { defineNuxtRouteMiddleware, useNuxtApp } from '#app'

export default defineNuxtRouteMiddleware((to) => {
  const { $auth } = useNuxtApp()
  if (!$auth.user) {
    return navigateTo('/login')
  }
})
