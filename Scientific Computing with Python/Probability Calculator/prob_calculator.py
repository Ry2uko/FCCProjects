# Hacked by Ry2uko :D
import copy
import random
# Consider using the modules imported above.

class Hat:
    def __init__(self, **balls):
        self.contents = []
        for color in balls:
            for n in range(0,balls[color]):
                self.contents.append(color)

    def draw(self, num):
        drawn = []
        
        if num >= len(self.contents):
            return self.contents
        
        for n in range(0, num):
            if len(self.contents) == 0:
                break
            randindex = random.randint(0, len(self.contents)-1)
            drawn.append(self.contents.pop(randindex))

        
        return drawn

def experiment(hat, expected_balls, num_balls_drawn, num_experiments):
    m = 0
    for count in range(0, num_experiments):
        hat_copy = copy.deepcopy(hat)
        drawn = hat_copy.draw(num_balls_drawn)
        valid = True
        for color in expected_balls:
            if expected_balls[color] > drawn.count(color):
                valid = False
                break
        if valid:
            m += 1
            
    return m / num_experiments

if __name__ == '__main__':
    # Test here
    pass