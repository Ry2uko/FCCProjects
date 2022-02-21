# Hacked by @Ry2uko :D
def arithmetic_arranger(problems, display_answer = False):

    if (len(problems) > 5):
        return 'Error: Too many problems.'
    
    arranged_problems = ''
    arranged_addends_one = ''
    arranged_addends_two = ''
    arranged_dashes = ''
    arranged_answers = ''
    
    operators = []
    # Addend or Subtrahend
    addends_one = []
    addends_two = []
    
    for problem in problems:
        split_problem = problem.strip().split()
  
        if len(split_problem) != 3:
            return 'Input Error'
        
        operators.append(split_problem[1])

        try:
            int(split_problem[0])
            int(split_problem[2])
        except ValueError:
            return 'Error: Numbers must only contain digits.'

        if len(split_problem[0]) > 4 or len(split_problem[2]) > 4:
            return 'Error: Numbers cannot be more than four digits.'
        
        addends_one.append(split_problem[0])
        addends_two.append(split_problem[2])

    # Arrange problem
    for i, addend in enumerate(addends_one): 
        addend_two = addends_two[i]
        operator = operators[i]

        if operator == '+':
            answer = str(int(addend) + int(addend_two))
        elif operator == '-':
            answer = str(int(addend) - int(addend_two))
        else:
            return "Error: Operator must be '+' or '-'."
            
        if len(addend) >= len(addend_two):
            len_diff = len(addend) - len(addend_two)
            ws_display = ' ' * len_diff
            dash_display = '-' * (len(addend)+2)

            if len(addend)+2 > len(answer):
                len_answer_diff = (len(addend)+2) - len(answer)
                ws_answer_display = ' ' *  len_answer_diff
                answer_display = ws_answer_display + answer
            else:
                answer_display = answer 
            
            if i == 0:
                arranged_addends_one += f'  {addend}'
                arranged_addends_two += f'{operator} {ws_display}{addend_two}'
                arranged_dashes += dash_display
                arranged_answers += answer_display
            else:
                arranged_addends_one += f'      {addend}'
                arranged_addends_two += f'    {operator} {ws_display}{addend_two}'
                arranged_dashes += f'    {dash_display}'
                arranged_answers += f'    {answer_display}'
                
        else:
            len_diff = len(addend_two) - len(addend)
            ws_display = ' ' * (len_diff+2)
            dash_display = '-' * (len(addend_two)+2)

            if len(addend_two)+2 > len(answer):
                len_answer_diff = (len(addend_two)+2) - len(answer)
                ws_answer_display = ' ' *  len_answer_diff
                answer_display = ws_answer_display + answer
            else:
                answer_display = answer 
            
            if i == 0:
                arranged_addends_one += f'{ws_display}{addend}'
                arranged_addends_two += f'{operator} {addend_two}'
                arranged_dashes += dash_display
                arranged_answers += answer_display
            else:
                arranged_addends_one += f'    {ws_display}{addend}'
                arranged_addends_two += f'    {operator} {addend_two}'
                arranged_dashes += f'    {dash_display}'
                arranged_answers += f'    {answer_display}'
                
        if i == len(addends_one) - 1:
                arranged_addends_one += '\n'
                arranged_addends_two += '\n'
                if display_answer:
                    arranged_dashes += '\n'

    arranged_problems = arranged_addends_one + arranged_addends_two + arranged_dashes 

    if display_answer:
        arranged_problems += arranged_answers
            
    return arranged_problems

if __name__ == '__main__':
    # Test Here
    pass