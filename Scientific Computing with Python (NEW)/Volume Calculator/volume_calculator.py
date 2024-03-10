""" Project 1: 3D Shape Volume Calculator """

import math

possible_shapes = [
    'cylinder',
    'sphere',
    'cube',
    'pyramid',
    'cone',
    'prism',
    'hemisphere',
    'cuboid',
]

calculate_cylinder = lambda r, h:    round(math.pi*(r**2)*h, 2)
calculate_sphere = lambda r:         round((4*math.pi*(r**3))/3, 2)
calculate_cube = lambda a:           round(a**3, 2)
calculate_pyramid = lambda l, w, h:  round((l*w*h)/3, 2)
calculate_cone = lambda r, h:        round((math.pi*(r**2)*h)/3, 2)
calculate_cuboid = lambda l, w, h:   round(l*w*h, 2)
calculate_hemisphere = lambda r:     round((2*math.pi*(r**3))/3,2)
calculate_prism = lambda l, w, h:    round(l*w*h, 2)


def calculate(shape):
    """ Return the calculation of given shape. """

    def get_dimension(dimensions):
        """ Prompt user for dimensions and check if valid """
        result = []

        for dimension in dimensions:
            while True:
                user_prompt = input(f'{dimension.title()}: ')
                try:
                    dimension_parsed = float(user_prompt)
                    result.append(dimension_parsed)
                    break
                except ValueError:
                    print(f'Invalid input.')

        return result[0] if len(result) == 1 else result

    match shape:
        case 'cylinder':
            radius, height = get_dimension(['radius', 'height'])
            return calculate_cylinder(radius, height)
        
        case 'sphere':
            radius = get_dimension(['radius'])
            return calculate_sphere(radius)
        
        case 'cube':
            edge = get_dimension(['edge'])
            return calculate_cube(edge)
        
        case 'pyramid':
            length, width, height = get_dimension(['base length', 'base width', 'height'])
            return calculate_pyramid(length, width, height)
        
        case 'cone':
            radius, height = get_dimension(['radius', 'height'])
            return calculate_cone(radius, height)
        
        case 'prism':
            length, width, height = get_dimension(['base length', 'base width', 'height'])
            return calculate_prism(length, width, height)
        
        case 'hemisphere':
            radius = get_dimension(['radius'])
            return calculate_hemisphere(radius)
        
        case 'cuboid':
            length, width, height = get_dimension(['length', 'width', 'height'])
            return calculate_cuboid(length, width, height)
        
        case _:
            return None


def main():
    print('----- 3D Shape Volume Calculator -----\n')
    
    print('List of 3d Shapes:')
    for i in range(len(possible_shapes)):
        print(f'{i+1}. {possible_shapes[i].title()}')

    print('\n(type "exit" to quit the program.)')
    while True:
        user_prompt = input('>>> ').lower()
        if user_prompt in possible_shapes:
            volume = calculate(user_prompt)
            print(f'{user_prompt.title()} Volume ≈ {volume} units')
        if user_prompt == 'exit':
            break


if __name__ == "__main__":
    main()