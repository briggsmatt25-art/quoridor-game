import React from 'react';
import { Button } from '@/components/ui/button';
import { Move, Columns2, Rows2, RotateCcw } from 'lucide-react';

export default function Controls({ state, onSetMode, onSetOrientation, onResetScores }) {
  const canPlaceWalls = state.wallsRemaining[state.currentPlayer] > 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        variant={state.mode === 'move' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSetMode('move')}
        className="gap-1.5 rounded-lg"
      >
        <Move className="w-4 h-4" />
        Move
      </Button>
      <Button
        variant={state.mode === 'wall' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSetMode('wall')}
        disabled={!canPlaceWalls}
        className="gap-1.5 rounded-lg"
      >
        <Rows2 className="w-4 h-4" />
        Wall
      </Button>
      {state.mode === 'wall' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSetOrientation(state.wallOrientation === 'h' ? 'v' : 'h')}
          className="gap-1.5 rounded-lg"
        >
          {state.wallOrientation === 'h' ? (
            <><Rows2 className="w-4 h-4" /> Horizontal</>
          ) : (
            <><Columns2 className="w-4 h-4" /> Vertical</>
          )}
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onResetScores}
        className="gap-1.5 rounded-lg text-muted-foreground"
      >
        <RotateCcw className="w-4 h-4" />
        Reset Scores
      </Button>
    </div>
  );
}
