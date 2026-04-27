type ToastApi = ReturnType<typeof useToast>
type ToastOptions = Parameters<ToastApi['add']>[0]
type AppToastOptions = Omit<ToastOptions, 'color' | 'icon'>
type AppToastInput = AppToastOptions | string

const appToastIcons = {
  success: 'i-lucide-circle-check',
  error: 'i-lucide-circle-x'
} as const

const resolveToastOptions = (
  input: AppToastInput,
  description?: ToastOptions['description']
): AppToastOptions => {
  if (typeof input === 'string') {
    return description === undefined ? { title: input } : { title: input, description }
  }

  return input
}

const createAppToast = () => {
  const toast = useToast()

  return {
    ...toast,
    success: (input: AppToastInput, description?: ToastOptions['description']) => toast.add({
      ...resolveToastOptions(input, description),
      color: 'success',
      icon: appToastIcons.success
    }),
    error: (input: AppToastInput, description?: ToastOptions['description']) => toast.add({
      ...resolveToastOptions(input, description),
      color: 'error',
      icon: appToastIcons.error
    })
  }
}

export const useAppToast = Object.assign(createAppToast, {
  success: (input: AppToastInput, description?: ToastOptions['description']) =>
    createAppToast().success(input, description),
  error: (input: AppToastInput, description?: ToastOptions['description']) =>
    createAppToast().error(input, description)
})
