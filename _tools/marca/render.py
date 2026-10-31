# -*- coding: utf-8 -*-
# Renderiza un SVG/HTML a PNG con Edge sin cabeza (tamaño exacto, fondo transparente opcional).
import os, subprocess, time

EDGE = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'


def edge_png(entrada, salida, w, h, transparente=False, espera=1500, escala=1):
    entrada = os.path.abspath(entrada)
    salida = os.path.abspath(salida)
    if os.path.exists(salida):
        os.remove(salida)
    url = 'file:///' + entrada.replace('\\', '/')
    args = [EDGE, '--headless=new', '--disable-gpu', '--hide-scrollbars',
            f'--window-size={w},{h}', f'--force-device-scale-factor={escala}',
            f'--virtual-time-budget={espera}', f'--screenshot={salida}']
    if transparente:
        args.append('--default-background-color=00000000')
    args.append(url)
    subprocess.run(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)
    for _ in range(20):
        if os.path.exists(salida) and os.path.getsize(salida) > 0:
            return salida
        time.sleep(0.3)
    raise RuntimeError('Edge no genero ' + salida)


if __name__ == '__main__':
    import sys
    edge_png(sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]))


def edge_pdf(entrada, salida, espera=8000):
    entrada = os.path.abspath(entrada)
    salida = os.path.abspath(salida)
    if os.path.exists(salida):
        os.remove(salida)
    url = 'file:///' + entrada.replace('\\', '/')
    args = [EDGE, '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
            f'--virtual-time-budget={espera}', f'--print-to-pdf={salida}', url]
    subprocess.run(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=180)
    for _ in range(30):
        if os.path.exists(salida) and os.path.getsize(salida) > 0:
            return salida
        time.sleep(0.4)
    raise RuntimeError('Edge no genero ' + salida)
