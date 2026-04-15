const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
})

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit'
})

export const formatDate = (value: string) => dateFormatter.format(new Date(value))

export const formatTime = (value: string) => timeFormatter.format(new Date(value))
