import { defineNuxtRouteMiddleware, useNuxtApp } from '#app'

export default defineNuxtRouteMiddleware(async (to) => {
  const { $auth } = useNuxtApp()

  if ($auth.user) {
    return navigateTo('/')
  }
})
