# Hacked by Ry2uko :D
days_of_week = {
    0: 'Monday',
    1: 'Tuesday',
    2: 'Wednesday',
    3: 'Thursday',
    4: 'Friday',
    5: 'Saturday',
    6: 'Sunday'
}

def add_time(start, duration, dayofweek = None):
    new_time = ''
    day_count = 0
    day_weekcount = 0
        
    # start
    time_splitted = start.split()[0].split(':')
    meridiem = start.split()[1].lower()
    hours = int(time_splitted[0])
    minutes = int(time_splitted[1])

    # duration 
    duration_splitted = duration.split(':')
    add_hours = int(duration_splitted[0])
    add_minutes = int(duration_splitted[1])

    if dayofweek:
        for n in days_of_week:
            if days_of_week[n].lower() == dayofweek.lower():
                day_weekcount = n
                break
    
    res_hours = hours + add_hours
    res_minutes = minutes + add_minutes
    
    while res_minutes >= 60:
        res_minutes -= 60
        res_hours += 1
     
    while res_hours > 12:
        res_hours -= 12
        if meridiem == 'am':
            meridiem = 'pm'
        else:
            meridiem = 'am'
            day_count += 1
            day_weekcount += 1

            if day_weekcount == 7:
                day_weekcount = 0
                
    if res_hours == 12:   
        if meridiem == 'am':
            meridiem = 'pm'
        else:
            meridiem = 'am'
            day_count += 1
            day_weekcount += 1

            if day_weekcount == 7:
                day_weekcount = 0

    display_hours = str(res_hours)
    display_minutes = str(res_minutes)
    display_meridiem = meridiem.upper()
    display_dayofweek = ''
    display_days = ''
    
    if dayofweek:
        display_dayofweek = f', {days_of_week[day_weekcount]}'
    if res_minutes < 10:
        display_minutes = f'0{str(res_minutes)}'
    if day_count == 1:
        display_days = ' (next day)'
    elif day_count > 1:
        display_days = f' ({str(day_count)} days later)'

    new_time = f'{display_hours}:{display_minutes} {display_meridiem}{display_dayofweek}{display_days}'
    
    return new_time

if __name__ == '__main__':
    # Test Here
    pass