# Hacked by Ry2uko ;}
import pandas as pd
import numpy as np

def calculate_demographic_data(print_data=True):
    df = pd.read_csv('adult.data.csv')
    
    race_count = df['race'].value_counts()
    
    average_age_men = df.loc[df['sex'] == 'Male']['age'].mean().round(1)
    
    percentage_bachelors = (df['education'].value_counts(normalize=True) * 100).round(1).loc['Bachelors']
    
    higher_education = df[df['education'].isin(['Bachelors', 'Masters', 'Doctorate'])]['salary']
    lower_education = df[~df['education'].isin(['Bachelors', 'Masters', 'Doctorate'])]['salary']
    higher_education_rich = (higher_education.value_counts(normalize=True) * 100).round(1)['>50K']
    lower_education_rich = (lower_education.value_counts(normalize=True) * 100).round(1)['>50K']
    
    min_work_hours = df['hours-per-week'].min()
    num_min_workers = df.loc[df['hours-per-week'] == min_work_hours]
    
    rich_percentage = (num_min_workers['salary'].value_counts(normalize=True) * 100).round(1)['>50K']
    
    percentage_series = np.round(df.loc[df['salary'] == '>50K']['native-country'].value_counts() / df['native-country'].value_counts() * 100, 1).sort_values(ascending=False)
    highest_earning_country = percentage_series.index[0]
    highest_earning_country_percentage = percentage_series[0]

    top_IN_occupation = df.loc[(df['salary'] == '>50K') & (df['native-country'] == 'India')]['occupation'].value_counts().index[0]
    
    # DO NOT MODIFY BELOW THIS LINE

    if print_data:
        print("Number of each race:\n", race_count) 
        print("Average age of men:", average_age_men)
        print(f"Percentage with Bachelors degrees: {percentage_bachelors}%")
        print(f"Percentage with higher education that earn >50K: {higher_education_rich}%")
        print(f"Percentage without higher education that earn >50K: {lower_education_rich}%")
        print(f"Min work time: {min_work_hours} hours/week")
        print(f"Percentage of rich among those who work fewest hours: {rich_percentage}%")
        print("Country with highest percentage of rich:", highest_earning_country)
        print(f"Highest percentage of rich people in country: {highest_earning_country_percentage}%")
        print("Top occupations in India:", top_IN_occupation)

    return {
        'race_count': race_count,
        'average_age_men': average_age_men,
        'percentage_bachelors': percentage_bachelors,
        'higher_education_rich': higher_education_rich,
        'lower_education_rich': lower_education_rich,
        'min_work_hours': min_work_hours,
        'rich_percentage': rich_percentage,
        'highest_earning_country': highest_earning_country,
        'highest_earning_country_percentage':
        highest_earning_country_percentage,
        'top_IN_occupation': top_IN_occupation
    }

if __name__ == '__main__':
    # Test here
    pass