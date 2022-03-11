# Hacked by Ry2uko :}
import numpy as np

def calculate(list):
    try:
        matrix = np.reshape(list, (3, 3))
    except ValueError:
        raise ValueError('List must contain nine numbers.')
    
    mean = [[], []]
    variance = [[], []]
    standard_deviation = [[], []]
    max = [[], []]
    min = [[], []]
    sum = [[], []]

    for i in range(3):
        axis1 = matrix[:, i].copy()
        axis2 = matrix[i].copy()
        
        mean[0].append(axis1.mean())
        mean[1].append(axis2.mean())
        variance[0].append(axis1.var())
        variance[1].append(axis2.var())
        standard_deviation[0].append(axis1.std())
        standard_deviation[1].append(axis2.std())
        max[0].append(axis1.max())
        max[1].append(axis2.max())
        min[0].append(axis1.min())
        min[1].append(axis2.min())
        sum[0].append(axis1.sum())
        sum[1].append(axis2.sum())
        
    mean.append(matrix.mean())
    variance.append(matrix.var())
    standard_deviation.append(matrix.std())
    max.append(matrix.max())
    min.append(matrix.min())
    sum.append(matrix.sum())

    calculations = {
        'mean': mean,
        'variance': variance,
        'standard deviation': standard_deviation,
        'max': max,
        'min': min,
        'sum': sum
    }
    
    return calculations

if __name__ == '__main__':
    # Test here
    pass