<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { User } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

const props = defineProps<{
  user: User
}>()

const supabase = useSupabaseClient<Database>()
const toast = useToast()
const isLoading = ref(false)

const logOut = async () => {
  try {
    isLoading.value = true

    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }

    await navigateTo('/login')
  } catch (error) {
    const description = error instanceof Error ? error.message : 'Could not log out.'

    toast.add({
      title: 'Could not log out',
      description,
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      slot: 'account',
      type: 'label'
    },
    {
      type: 'separator'
    },
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-6-tooth'
    },
    {
      label: 'Log out',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      disabled: isLoading.value,
      onSelect: logOut
    }
  ]
])
</script>

<template>
  <UDropdownMenu :items="items" :content="{ align: 'end' }">
    <UButton
      color="neutral"
      variant="ghost"
      square
      class="rounded-full p-0"
      :loading="isLoading"
      :disabled="isLoading"
    >
      <UAvatar
        :src="props.user.user_metadata?.avatar_url ?? props.user.user_metadata?.picture ?? undefined"
        :alt="props.user.email || 'User menu'"
        icon="i-heroicons-user"
        size="xl"
      />
    </UButton>

    <template #account>
      <div class="flex items-center gap-3">
        <UAvatar
          :src="props.user.user_metadata?.avatar_url ?? props.user.user_metadata?.picture ?? undefined"
          :alt="props.user.email || 'User menu'"
          icon="i-heroicons-user"
          size="xl"
        />

        <div class="min-w-0">
          <div class="truncate font-medium text-sm text-gray-900 dark:text-gray-100">
            {{ props.user.email || 'Signed in user' }}
          </div>
        </div>
      </div>
    </template>
  </UDropdownMenu>
</template>
