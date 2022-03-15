# Hacked by Ry2uko ;}
import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import linregress

def draw_plot():
    df = pd.read_csv('epa-sea-level.csv')
    
    fig, ax = plt.subplots(figsize=(8,8))
    ax.scatter(df['Year'], df['CSIRO Adjusted Sea Level'])

    regress = linregress(df['Year'], df['CSIRO Adjusted Sea Level'])
    x_pred = pd.Series([i for i in range(1880, 2051)])
    y_pred = (regress.slope*x_pred) + regress.intercept
    n_def = df.loc[df['Year'] >= 2000]
    regress2 = linregress(n_def['Year'], n_def['CSIRO Adjusted Sea Level'])
    x_pred2 = pd.Series([i for i in range(2000,2051)])
    y_pred2 = (regress2.slope*x_pred2) + regress2.intercept
    
    plt.plot(x_pred, y_pred, 'green')
    plt.plot(x_pred2, y_pred2, 'violet')

    ax.set_title('Rise in Sea Level')
    ax.set_xlabel('Year')
    ax.set_ylabel('Sea Level (inches)')
    
    plt.savefig('sea_level_plot.png')
    return plt.gca()

if __name__ == '__main__':
    # Test here
    pass