export function isStoreOpen(): { open: boolean; message: string; nextOpenTime?: string } {
    // Get current time in Bolivia (GMT-4)
    const now = new Date()


    // A more robust way to get the exact parts in the timezone:
    const tzDateString = now.toLocaleString('en-US', { timeZone: 'America/La_Paz' })
    const tzDate = new Date(tzDateString)

    const day = tzDate.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = tzDate.getHours()

    // Define open status based on day and hour
    let open = false
    if (day >= 1 && day <= 6) { // Mon-Sat
        if (hour >= 8 && hour < 22) {
            open = true
        }
    } else if (day === 0) { // Sun
        if (hour >= 9 && hour < 21) {
            open = true
        }
    }

    if (open) {
        return { open: true, message: 'Estamos atendiendo' }
    }

    // Calculate next open time
    let nextOpenTime = ''
    if (day >= 1 && day <= 5) {
        if (hour < 8) nextOpenTime = 'Hoy a las 8:00 AM'
        else nextOpenTime = 'Mañana a las 8:00 AM'
    } else if (day === 6) { // Saturday
        if (hour < 8) nextOpenTime = 'Hoy a las 8:00 AM'
        else nextOpenTime = 'Mañana (Domingo) a las 9:00 AM'
    } else if (day === 0) { // Sunday
        if (hour < 9) nextOpenTime = 'Hoy a las 9:00 AM'
        else nextOpenTime = 'Mañana (Lunes) a las 8:00 AM'
    }

    return {
        open: false,
        message: 'Fuera de horario de atención',
        nextOpenTime
    }
}
