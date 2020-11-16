# Checkers Minimax AI
Built a checkers AI using a mini-max algorithm with alpha-beta pruning to look 8 moves ahead.

## Context
This was quite the doozy. I've already done the NEAT algorithm, so I wanted to try out the mini-max algorithm. I've done so already in an Intro to AI course, but I wanted something from scratch. The hardest part of building the project was actually programming checkers. Partway through development, I realized I had misunderstood the rules, which messed up my architectural design a bit as well.

If I had to redo this project, I definitely would have spent more time designing and planning my approach rather than going at it blindly and improvising on the way. One thing that was made fairly obvious to me was that in university, you are provided the starting code and skeleton of the project. So you have a general idea of what the "best practice" is. I will definitely approach the design process more carefully in the future.

The mini-max algorithm was fairly easy to set up, particularly since I had already built the algorithm before. The algorithm looks 8 steps into the future, using alpha-beta pruning to reduce the amount of board states analyzed. Once the max depth of recursion is reached, the board state is analyzed using a heuristic. For this implementation, a board is rated based on the pieces in play. Regular pieces are worth 1, and kinged pieces are worth 2. The total value of red and black pieces are calculated separately, and the difference is taken `black_pieces - red_pieces`. The black player seeks to maximize this value, and the red player seeks to minimize the value.

## Known Bugs
While the AI is thinking, the user cannot interact with the UI. This is due to the fact that Javascript does not support multithreading, so I cannot move the AI processing to a different thread. I'm not sure how I can work around this, so that's a bug that is staying for the time being.

## How to Use
You can play against the AI at https://defcoding.github.io/checkers-ai
