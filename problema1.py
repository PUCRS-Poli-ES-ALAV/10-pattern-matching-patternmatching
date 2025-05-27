def find(sub, s):
    """
    Retorna a posição da primeira ocorrência de uma substring em uma string.
    
    :return: A posição da primeira ocorrência ou -1 se não encontrado.
    """
    for i in range(len(s)):
        if s[i:i + len(sub)] == sub:
            return i
    return -1


def duasStringsVerificaPrimeiraOcorrenciaS1EmS2(s1, s2):
    """
    Verifica se a primeira ocorrência de s1 em s2 é igual a s1.
    
    :param s1: String a ser verificada.
    :param s2: String onde será verificada a ocorrência de s1.
    :return: A posição da primeira ocorrência de s1 em s2 se for igual a s1, caso contrário -1.
    """
    posicao = find(s1, s2)
    if posicao == -1:
        return -1
    # Verifica se a substring encontrada é igual a s1
    elif s2[posicao:posicao + len(s1)] == s1:
        return posicao
    else:
        # Se a substring encontrada não é igual a s1, retorna -1
        return -1


def main():
    # Test cases
    s1 = "abc"
    s2 = "xyzabcdef"
    result = duasStringsVerificaPrimeiraOcorrenciaS1EmS2(s1, s2)
    print(f"String '{s1}' found in '{s2}': {result}")
    
    s1 = "hello"
    s2 = "world"
    result = duasStringsVerificaPrimeiraOcorrenciaS1EmS2(s1, s2)
    print(f"String '{s1}' found in '{s2}': {result}")


if __name__ == "__main__":
    main()