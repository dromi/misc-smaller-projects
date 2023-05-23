import json
import sys
import time
from io import BytesIO

import pygame
import requests
from PIL import Image
import numpy as np

IM_SIZE = (350, 500)
DR_IMG_SIZE = (1000, 750)
SLEEP_TIME = 0.01
MORPH_STEPS = 100

DR_URL = "https://historiskebilleder.danskkulturarv.dk/api/images/random"


def main():
    arnie = Image.open("arnold.jpeg").resize(IM_SIZE)
    keanu = Image.open("keanu.jpg").resize(IM_SIZE)

    arnie_grid = np.array(arnie)
    keanu_grid = np.array(keanu)

    start = arnie_grid
    stop = keanu_grid

    diff_grid = stop - start
    step_grid = diff_grid / MORPH_STEPS

    pygame.init()
    screen = pygame.display.set_mode(IM_SIZE)
    i = 0
    ite = 1
    while True:
        # check for quit events
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        current_grid = start + (step_grid * i)
        surf = pygame.surfarray.make_surface(current_grid.transpose(1, 0, 2).astype(np.uint8))
        screen.blit(surf, (0, 0))

        pygame.display.update()
        time.sleep(SLEEP_TIME)
        if i > 100:
            ite = -1
        if i < 0:
            ite = 1
        i += ite


def get_random_pic():
    response = requests.get(url=DR_URL)
    json_data = json.loads(response.text)[0]
    img = Image.open(BytesIO(requests.get(json_data['url']).content))
    img = img.resize(DR_IMG_SIZE)
    return img


def img_main():
    pygame.init()
    screen = pygame.display.set_mode(DR_IMG_SIZE)
    start = np.array(get_random_pic())
    stop = np.array(get_random_pic())
    diff_grid = stop - start
    step_grid = diff_grid / MORPH_STEPS
    i = 0
    while True:
        # check for quit events
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        current_grid = start + (step_grid * i)
        surf = pygame.surfarray.make_surface(current_grid.transpose(1, 0, 2).astype(np.uint8))
        screen.blit(surf, (0, 0))

        pygame.display.update()
        i += 1
        if i == MORPH_STEPS:
            surf = pygame.surfarray.make_surface(stop.transpose(1, 0, 2).astype(np.uint8))
            screen.blit(surf, (0, 0))
            pygame.display.update()

            start = stop
            stop = np.array(get_random_pic())
            diff_grid = stop - start
            step_grid = diff_grid / MORPH_STEPS
            i = 0

        # time.sleep(SLEEP_TIME)

if __name__ == '__main__':
    # Read in both images
    # main()
    img_main()
