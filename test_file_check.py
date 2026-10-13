import os
import chardet

for name in ['stoßwellentherapie.html','wirbelsauledekompression.html']:
    if os.path.exists(name):
        print('OK:', name)
        with open(name, 'rb') as fp:
            data = fp.read()
        det = chardet.detect(data)
        print('  -> bytes:', len(data), 'encoding:', det['encoding'])
    else:
        print('MISSING:', name)
