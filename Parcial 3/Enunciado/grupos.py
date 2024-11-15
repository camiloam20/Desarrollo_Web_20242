def isEven(document):
    document2 = str(document)
    if document2.isnumeric():
        n1 = document % 1000
    else:
        n1 = ord(document[-1]) + ord(document[-2]) + ord(document[-3])

    n2 = n1 // 100 + n1 // 10 + n1 % 10
    if n2 % 2 == 0:
        return "Eres par"
    return "Eres impar"

print(isEven(1000874557))
