# Hacked by Ry2uko
import math

class Category:
    
    def __init__(self, category):
        self.category = category.title()     
        self.ledger = []
    
    def deposit(self, amount, desc=""):
        self.ledger.append({
            "amount": amount,
            "description": desc
        })

    def get_balance(self):
        total_amount = 0
        
        for obj in self.ledger:
            total_amount += obj.get('amount')
            
        return total_amount

    def check_funds(self, amount):
        balance = self.get_balance()
        
        if float(amount) > float(balance):
            return False
            
        return True
        
    def withdraw(self, amount, desc=""):
        if self.check_funds(amount):
            self.ledger.append({
                "amount": (-1*amount),
                "description": desc
            })
            return True 

        return False

    def transfer(self, amount, category):
        res = self.withdraw(amount, f'Transfer to {category.category}')
        
        if res:
            category.deposit(amount, f'Transfer from {self.category}')

        return res
        
    def __repr__(self):
        representation = ''
        
        ast_display = '*' * ((30-len(self.category)) // 2)
        new_line = f'{ast_display}{self.category}{ast_display}\n'
        representation += new_line

        for index, item in enumerate(self.ledger):
            amount_display = '{:.2f}'.format(math.floor(item.get('amount') * 100) / 100)
            amount_display = amount_display[::-1][:7][::-1] 
            description_display = item.get('description')[:23]
            
            amount_ws = ' ' * (7-len(amount_display))
            description_ws = ' ' * (23-len(description_display))
            amount_display = amount_ws + amount_display
            description_display = description_display + description_ws

            repr_item = description_display + amount_display

            repr_item += '\n'
            
            if index == len(self.ledger)-1:
                formatted = '{:.2f}'.format(math.floor(self.get_balance() * 100) / 100)
                repr_item += f'Total: {formatted}'
                
            representation += repr_item
        
        return str(representation)

def create_spend_chart(categories):
    chart = 'Percentage spent by category\n'
    total_amount = 0
    percentage_dict = {}
    
    for category in categories:
        for item in category.ledger:
            if item.get('amount') < 0:
                total_amount += item.get('amount')

    total_amount *= -1

    for category in categories:
        amount = 0
        for item in category.ledger:
            if item.get('amount') < 0:
                amount += item.get('amount')
        percentage_dict[category.category] = math.floor((amount / total_amount) * -10) * 10
    
    for n in reversed(range(0, 101, 10)):
        chart += (f'{str(n).rjust(3)}| ')
        for index, category in enumerate(percentage_dict):
            if percentage_dict.get(category) >= n:
                chart += 'o  '
            else:
                chart += '   '
            if index == len(percentage_dict)-1:
                chart += '\n'

    dash_display = '-' * ((len(percentage_dict)*3)+1)
    chart += dash_display.rjust((len(percentage_dict)*3)+5) + '\n'

    category_list = [key for key in percentage_dict]
    category_list.sort(key=len, reverse = True)

    for index, char in enumerate(category_list[0]):
        char_line = ''
        for index2, category in enumerate(categories):
            try:
                char_line += f'{category.category[index]}  '
            except:
                char_line += '   '
        chart += char_line.rjust((len(percentage_dict)*3)+5) + '\n'
        if index == len(category_list[0]) - 1:
            chart = chart[:-1]
    
    return chart

if __name__ == '__main__':
    # Test Here
    pass