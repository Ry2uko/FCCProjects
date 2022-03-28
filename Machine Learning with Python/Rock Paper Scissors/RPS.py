# Hacked by Ry2uko ;}
# Most hardest challenge
import random

def player(prev_opponent_play, opponent_history=[], plays=[], play_order=[{
    "RR": 0,
    "RP": 0,
    "RS": 0,
    "PR": 0,
    "PP": 0,
    "PS": 0,
    "SR": 0,
    "SP": 0,
    "SS": 0,
}]):            
    opponent_history.append(prev_opponent_play)
    ideal_response = {'P': 'S', 'R': 'P', 'S': 'R'}
    
    guess = 'R'

    # Can't beat Abbe. Almost gave up. Suprisingly, increasing the initial number solves the problem 
    if len(opponent_history) <= 20:  
        plays.append(guess)
        return guess
    
    mod_history = opponent_history[-10:][1:]
    mod_plays = plays[-10:][:-1]
    mock_score = 0

    for i in range(len(mod_plays)):
        if ideal_response[mod_plays[i]] == mod_history[i]:
            mock_score += 1
            
    if mock_score == 9:
        # Kris strat - counter the counter lol
        next_play = plays[-1]
        player_counter = ideal_response[next_play]
        opp_counter = ideal_response[player_counter]
        
        guess = opp_counter
        plays.append(guess)
        return guess

    else:
        # Abbe strat + others - used its code to counter itself
        if not prev_opponent_play:
            prev_opponent_play = 'R'
            opponent_history.append(prev_opponent_play)
        last_two = "".join(opponent_history[-2:])
        
        if len(last_two) == 2:
            play_order[0][last_two] += 1
    
        potential_plays = [
            prev_opponent_play + "R",
            prev_opponent_play + "P",
            prev_opponent_play + "S",
        ]
    
        sub_order = {
            k: play_order[0][k]
            for k in potential_plays if k in play_order[0]
        }

        guess = ideal_response[max(sub_order, key=sub_order.get)[-1:]]
        
    plays.append(guess)
    return guess

if __name__ == '__main__':
    # Test here
    pass