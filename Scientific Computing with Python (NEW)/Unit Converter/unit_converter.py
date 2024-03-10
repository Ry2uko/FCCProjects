""" Project 2: Any Calculator/Converter (idk what else to name this) """

import math
import re
from fractions import Fraction

possible_converters = [
    'bmi',
    'temperature',
    'weight',
    'angle',
    'fraction',
]

# Options on user input
temperatures = ['celcius', 'fahrenheit', 'kelvin']
weights = ['ton', 'tonne', 'kg', 'lb', 'oz', 'g']
angles = ['degree', 'radian']
decimal_fraction = ['decimal', 'fraction']


def calculate_bmi(weight, height):
    """ Calculate BMI given weight (kg) and height (cm) and classification. """

    # BMI = weight (kg) / (height (m))^2
    height_m = height / 100
    bmi = round(weight / height_m**2, 2)

    classification = 'Underweight'
    if bmi >= 18.5 and bmi <= 24.9:
        classification = 'Normal'
    elif bmi >= 25 and bmi <= 29.9:
        classification = 'Overweight'
    elif bmi >= 30 and bmi <= 34.9:
        classification = 'Obese (Class 1)'
    elif bmi >= 35 and bmi <= 39.9:
        classification = 'Obese (Class 2)'
    elif bmi >= 40:
        classification = 'Obese (Class 3 or Severe Obesity)'
    
    return bmi, classification


def convert_temperature(temp, temp_type='celcius', temp2_type='fahrenheit'):
    """ Convert temperatures between celcius, fahrenheit, and kelvin. """

    to_fahrenheit = lambda c: round(c*(9/5) + 32, 2)
    to_celcius = lambda f: round((f-32)*(5/9), 2)
    to_kelvin = lambda c: round(c+273.15, 2)
    to_celcius_kelvin = lambda k: round(k-273.15, 2)

    if temp_type not in temperatures or temp2_type not in temperatures:
        return None

    # Celcius  
    if temp_type == 'celcius':
        if temp2_type == 'fahrenheit': 
            return to_fahrenheit(temp)
        elif temp2_type == 'kelvin':
            return to_kelvin(temp)
    
    # Fahrenheit
    if temp_type == 'fahrenheit':
        if temp2_type == 'celcius':
            return to_celcius(temp)
        elif temp2_type == 'kelvin':
            return to_kelvin(to_celcius(temp))
    
    # Kelvin
    if temp_type == 'kelvin':
        if temp2_type == 'celcius':
            return to_celcius_kelvin(temp)
        elif temp2_type == 'fahrenheit':
            return to_fahrenheit(to_celcius_kelvin(temp))

    return temp


def convert_weight_imperial(wght, wght_type='g', wght2_type='kg'):
    """ Convert weight (imperial) between g, kg, ton (us), tonne (metric ton), lb, and oz """

    # m parameter for backward conversion
    wght_conversions = {
        'ton': lambda g, m=True: round(g/907000 if m else g*907000, 2),
        'tonne': lambda g, m=True: round(g/1000000 if m else g*1000000, 2),
        'kg': lambda g, m=True: round(g/1000 if m else g*1000, 2),
        'lb': lambda g, m=True: round(g/453.59 if m else g*453.59, 2),
        'oz': lambda g, m=True: round(g/28.35 if m else g*28.35, 2),
    }

    if wght2_type == 'g':
        return wght_conversions[wght_type](wght, m=False)
    elif wght_type != 'g':
        wght_g = wght_conversions[wght_type](wght, m=False) # convert to gram first
        return wght_conversions[wght2_type](wght_g)
    
    return wght_conversions[wght2_type](wght)


def convert_angle(angle, angle_type='degree', angle2_type='radian'):
    """ Convert angle between degree and radian. """

    to_radian = lambda d: round(d*(math.pi/180), 5)
    to_degree = lambda r: round(r*(180/math.pi), 5)

    if angle_type == 'degree' and angle2_type == 'radian':
        return to_radian(angle)
    elif angle_type == 'radian' and angle2_type == 'degree':
        return to_degree(angle)

    return angle


def convert_to_decimal(frac):
    """ Convert fraction to decimal. """
    fraction_pattern = re.compile(r'\s*(\d*\.?\d*)\s*/\s*(\d*\.?\d*)\s*')
    matched_fraction = fraction_pattern.search(frac)   

    if matched_fraction:
        d1 = float(matched_fraction.group(1))
        d2 = float(matched_fraction.group(2))

        return round(d1 / d2, 5)


def convert_to_fraction(dec):
    """Convert decimal to fraction. """
    return Fraction(dec)


def convert(conversion_type):
    """ Return the conversion of given type of conversion. """

    def get_user_input(prompts):
        """ Get user input given prompts (dictionary) and expected data type. """

        result = []
        for prompt, prompt_constraint in prompts.items():
            prompt_type = prompt_constraint[0]
            prompt_filter = prompt_constraint[1]

            while True:
                user_prompt = input(f'{prompt}: ')

                if not user_prompt:
                    continue

                if prompt_type == 'num':
                    try:
                        user_prompt = float(user_prompt)
                    except ValueError:
                        print(f'Invalid input.')
                        continue
                elif prompt_type == 'str' and prompt_filter is not None:
                    if user_prompt.lower() not in prompt_filter:
                        print(f'Invalid input. Please choose one of the provided options.')
                        continue
                    user_prompt = user_prompt.lower()

                result.append(user_prompt)
                break
        
        return result
                    

    match conversion_type:
        case 'bmi':
            weight, height = get_user_input({
                'Weight (kg)': ('num', None),
                'Height (cm)': ('num', None),
            })

            bmi, classification = calculate_bmi(weight, height)
            print(f'BMI: {bmi}')
            print(f'Classification: {classification}')

        case 'temperature':
            print('Temperatures:\n'
                  '> Celcius\n'
                  '> Fahrenheit\n'
                  '> Kelvin\n')
            
            temp_type, temp2_type, temp = get_user_input({
                'From': ('str', temperatures),
                'To': ('str', temperatures),
                'Temperature': ('num', None),
            })

            converted_temp = convert_temperature(temp, temp_type, temp2_type)
            print_temp = lambda n, m: f'{n} K' if m == 'kelvin' else f'{n} \N{DEGREE SIGN}C' if m == 'celcius' else f'{n} \N{DEGREE SIGN}F'

            print(f"{print_temp(temp, temp_type)} --> {print_temp(converted_temp, temp2_type)}")

        case 'weight':
            print('Units:\n'
                  '> ton (US ton)\n'
                  '> tonne (metric ton)\n'
                  '> kg (kilogram)\n'
                  '> g (gram)\n'
                  '> lb (pound)\n'
                  '> oz (ounce\n')
            
            wght_type, wght2_type, wght = get_user_input({
                'From': ('str', weights),
                'To': ('str', weights),
                'Weight': ('num', None)
            })
            
            converted_wght = convert_weight_imperial(wght, wght_type, wght2_type)
            print(f'{wght} {wght_type} --> {converted_wght} {wght2_type}')

        case 'angle':
            print('PI symbol is not allowed (e.g. 2pi). Instead, convert to decimal: 6.283185307179586\n')
            print('Angles:\n'
                  '> degree\n'
                  '> radian\n')
                
            angle_type, angle2_type, angle = get_user_input({
                'From': ('str', angles),
                'To': ('str', angles),
                'Angle': ('num', None)
            })

            converted_angle = convert_angle(angle, angle_type, angle2_type)
            print_angle = lambda n, m: f'{n}\N{DEGREE SIGN}' if m == 'degree' else f'{n}rad'
            print(f'{print_angle(angle, angle_type)} --> {print_angle(converted_angle, angle2_type)}')

        case 'fraction':
            print('Conversion:\n'
                  '> fraction (degree to fraction)\n'
                  '> decimal (fraction to degree)\n')
                
            convert_to, = get_user_input({
                'Convert to': ('str', decimal_fraction),
            })

            if convert_to == 'decimal':
                while True:
                    fraction_input, = get_user_input({
                        'Fraction': ('str', None),
                    })
                    decimal_output = convert_to_decimal(fraction_input)
                    if decimal_output is None:
                        print('Invalid Fraction.')
                    else:
                        print(f'{fraction_input} --> {decimal_output}')
                        break
            else:
                decimal_input, = get_user_input({
                    'Decimal': ('num', None),
                })
                fraction_output = convert_to_fraction(decimal_input)
                print(f'{decimal_input} --> {fraction_output}')

        case _:
            return None


def main():
    def print_options():
        print('Possible Options:\n'
          '1. BMI\n'
          '2. Temperature\n'
          '3. Weight\n' 
          '4. Angle\n'
          '5. Fraction\n')

    print('----- Any Converter/Calcultor -----\n')
    print_options()

    print('(type "exit" to quit the program or "list" to view possible options.)')
    while True:
        user_prompt = input('>>> ').lower()
        if user_prompt in possible_converters:
            convert(user_prompt)
        if user_prompt == 'exit':
            break
        elif user_prompt == 'list':
            print_options()


if __name__ == '__main__':
    main()
