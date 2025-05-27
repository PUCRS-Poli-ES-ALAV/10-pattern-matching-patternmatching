
pattern = "existir"

s = "Dadas duas strings, s1 e s2, verificar a posição da primeira ocorrência de se s2 em s1, se existir."

def find_pattern(s, pattern) -> int:
    n = len(s)
    m = len(pattern)
    
    for i in range(n):
        k = i
        for j in range(m):
            current_pattern_char = pattern[j]
            current_s_char = s[k]
            
            print(f"Comparing: {current_s_char} with {current_pattern_char}")
            
            if current_s_char == current_pattern_char:
                pattern_ended = j >= m - 1
                
                if pattern_ended:
                    print(f"End reached!")
                    return i
                
                k += 1
                current_s_char = s[k]            
                continue
                
            
            print(f"Miss: {s[i]} != {pattern[j]}")
            break
            
            
print(find_pattern(s, pattern))