# Hacked By Ry2uko ;}
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

df = pd.read_csv('medical_examination.csv')


def is_overweight(row):
  height_in_meters = row['height'] / 100
  bmi = row['weight'] / height_in_meters**2

  if bmi > 25:
    return 1
  
  return 0


df['overweight'] = df.apply(is_overweight, axis=1)
df['cholesterol'] = np.where(df['cholesterol'] == 1, 0, 1)
df['gluc'] = np.where(df['gluc'] == 1, 0, 1)


def draw_cat_plot():
    df_cat = pd.melt(df, id_vars=['cardio'], value_vars=['cholesterol', 'gluc', 'smoke', 'alco', 'active', 'overweight'])

    df_cat['total'] = 1
    df_cat = df_cat.groupby(['cardio', 'variable', 'value'], as_index=False).count()

    fig = sns.catplot(x='variable', y='total', data=df_cat, hue='value', kind='bar', col='cardio').fig

    fig.savefig('catplot.png')
    return fig


def draw_heat_map():
    df_heat = df[
        (df['ap_lo'] <= df['ap_hi']) &
        (df['height'] >= df['height'].quantile(0.025)) &
        (df['height'] <= df['height'].quantile(0.975)) &
        (df['weight'] >= df['weight'].quantile(0.025)) &
        (df['weight'] <= df['weight'].quantile(0.975))
    ]

    corr = df_heat.corr(method='pearson')
    mask = np.triu(corr)

    fig, ax = plt.subplots(figsize=(10, 10))
    sns.heatmap(corr, linewidths=1, annot=True, square=True, mask=mask, fmt='.1f', center=0.08, cbar_kws={'shrink': 0.5})

    fig.savefig('heatmap.png')
    return fig


if __name__ == '__main__':
    # Test here
    pass