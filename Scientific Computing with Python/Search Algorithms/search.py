""" Project 3: Search Algorithms """

import time, random


def linear_search(items, target):
    """ Search items list with linear search - O(n) """

    for item in items:
        if item == target:
            return True
        
    return False


def binary_search(items, x):
    """ Search items list (sorted) with binary search - O(log n) """

    length = len(items)
    if (length == 1 and items[0] != x) or length == 0:
        return False
    
    middle_index = length // 2

    if x == items[middle_index]:
        return True
    elif x < items[middle_index]:
        return binary_search(items[:middle_index], x)
    else:
        return binary_search(items[middle_index:], x)


def time_search(search_fn, items, key):
    start = time.time()

    if search_fn(items, key):
        print('Item found in list.')
    else:
        print('Item not found in list.')

    end = time.time()

    return round(end - start, 4)


def main():
    print("Linear Search vs Binary Search\n")
    while True:
        try:
            search_x = int(input('Search for: '))
            break
        except ValueError:
            continue

    print("\nSorted List\n")
    items = list(range(10000000))
    print(f'Linear Search: {time_search(linear_search, items, search_x)}s\n')
    print(f'Binary Search: {time_search(binary_search, items, search_x)}s')
    
    print('\nUnsorted List\n')
    random.shuffle(items)
    print(f'Linear Search: {time_search(linear_search, items, search_x)}s\n')
    print(f'Binary Search: {time_search(binary_search, items, search_x)}s')

    print('\nNote: Binary search does not work for unsorted list.')


if __name__ == '__main__':
    main()