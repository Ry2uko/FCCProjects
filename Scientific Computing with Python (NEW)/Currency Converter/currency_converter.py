""" Project 5: Currency Converter """

import requests

def main():
    print("Currency Converter\n")
    print("""Common Currencies:
1. USD (US Dollar)
2. EUR (Euro)
3. JPY (Japanese Yen)
4. GBP (British Pound Sterling)
5. AUD (Australian Dollar)
6. CAD (Canadian Dollar)
7. CHF (Swiss Franc)
8. CNY (Chinese Yuan Renminbi)
9. SEK (Swedish Krona)
10. NZD (New Zealand Dollar)""")

    currencies = requests.get('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.min.json')
    currencies = list(currencies.json().keys())

    def validate_currency(prompt):
        user_input = input(prompt).lower()
        
        if user_input in currencies:
            return user_input.upper()

        print("Error: Currency not available.")
        return validate_currency(prompt)

    def get_amount(prompt):
        try:
            amount_input = float(input(prompt))
            if amount_input <= 0:
                print("Error: Amount must be greater than 0.")
            else:
                return amount_input
        except ValueError:
            print("Error: Invalid amount input.")
            pass

        return get_amount(prompt)

    print("\n(Please enter the currency code.)")
    while True:
        convert_from = validate_currency("Convert From: ")
        convert_to = validate_currency("Convert To: ")  
        amount = get_amount(f"Amount ({convert_from}): ")

        # Get conversion rate
        conversion_rate_data = requests.get(f'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{convert_from.lower()}.min.json')
        conversion_rate_data = conversion_rate_data.json()
        conversion_rate = float(conversion_rate_data[convert_from.lower()][convert_to.lower()])

        # Calculate converted amount
        converted_amount = round(amount * conversion_rate, 2)
        print(f"Amount ({convert_to}): {converted_amount}")

        if input("Quit program? (y/n)").lower().strip() == 'y':
            return
        print()
                
    
if __name__ == '__main__':
    main()