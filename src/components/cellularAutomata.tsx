import React, { useEffect, useRef, useState } from 'react';
import SettingsMenu from './SettingsMenu';


const CellularAutomaton: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [grid, setGrid] = useState<number[][]>([]);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState(true);
    const [drawRadius, setRadius] = useState(2);
    const [cols, setCols] = useState(50);
    const [rows, setRows] = useState(50);
    const [refreshDelay, setRefreshDelay] = useState(500);

    const [drawAddChance, setDrawAddChance] = useState<number>(0.5);


    /**
     * Resizes the board when the screen does
     * @returns 
     */
    const resizeHandler = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.parentElement?.getBoundingClientRect();
        if (!rect) return;

        canvas.width = rect.width;
        canvas.height = rect.height;

        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        setCols(Math.round(rows * canvas.width / canvas.height))

    };

    /**
     * Mutates the cells of grid based on rules
     * @param updatedGrid the grid with updated values
     */
    const updateGrid = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // stores new grid
        const updatedGrid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));

        // used to fill grid when its been resized
        const resizeTempGrid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));

        // Iterate over the columns and rows to copy the existing grid values
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                // If the current cell in the existing grid has a value, copy it; otherwise, set it to 0
                resizeTempGrid[i][j] = grid[i]?.[j] ?? 0;
            }
        }
        // console.log(resizeTempGrid)
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let count = 0;
                for (let ii = -1; ii <= 1; ii++) {
                    for (let jj = -1; jj <= 1; jj++) {
                        if (ii === 0 && jj === 0) continue; // Skip the current cell
                        const x = i + ii;
                        const y = j + jj;
                        if (x >= 0 && x < rows && y >= 0 && y < cols && resizeTempGrid[x][y] === 1) {
                            count++;
                        }
                    }
                }
                const alreadyAlive = resizeTempGrid[i][j] === 1;
                const threeNeighbors = count === 3;
                const twoNeighbors = count === 2;

                updatedGrid[i][j] = ((alreadyAlive && (threeNeighbors || twoNeighbors)) || (!alreadyAlive && threeNeighbors)) ? 1 : 0;
            }
        }
        setGrid(updatedGrid);
    };

    /**
     * Draws the grid in a canvas
     * @returns 
     */
    const drawGrid = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cellSize = Math.round(canvas.height / rows)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 0.5
        for (let i = 0; i <= canvas.width; i += cellSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let j = 0; j <= canvas.height; j += cellSize) {
            ctx.beginPath();
            ctx.moveTo(0, j);
            ctx.lineTo(canvas.width, j);
            ctx.stroke();
        }
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (grid[i]?.[j]) {
                    ctx.fillStyle = grid[i][j] === 1 ? 'red' : 'white';
                    // careful, i and j should be swapped here because 
                    //      canvas defines x as the horizontal direction, instead of i being the row index (vertical direction)
                    ctx.fillRect(j * cellSize + 1, i * cellSize + 1, cellSize - 1, cellSize - 1);
                }
            }
        }
    };

    const handleMouseDown = () => {
        setIsMouseDown(true);
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    /**
     * Changes the value of a cell that the user clicked on
     * @param cellValue the value of the current cell
     * @returns the new value of the cell
     */
    const changeCellOnClick = (cellValue: number): number => {
        return (Math.random() < drawAddChance) ? 1 : 0;

    }

    const handleMouseMove = async (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isMouseDown) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const cellSize = Math.round(canvas.height / rows);
        const col = Math.round(mouseX / cellSize);
        const row = Math.round(mouseY / cellSize);

        // Create a new grid with the same dimensions as the existing grid
        const updatedGrid = new Array(rows);
        for (let i = 0; i < rows; i++) {
            updatedGrid[i] = new Array(cols);
        }

        // Copy values from the existing grid to the new grid
        const minRows = Math.min(rows, grid.length);
        const minCols = Math.min(cols, grid[0]?.length || 0);

        for (let i = 0; i < minRows; i++) {
            for (let j = 0; j < minCols; j++) {
                updatedGrid[i][j] = grid[i]?.[j] ?? 0;
            }
        }

        // Update all cells within the radius
        for (let i = row - drawRadius; i <= row + drawRadius; i++) {
            for (let j = col - drawRadius; j <= col + drawRadius; j++) {
                if (i >= 0 && i < rows && j >= 0 && j < cols) {
                    updatedGrid[i][j] = changeCellOnClick(updatedGrid[i][j])
                }
            }
        }

        setGrid(updatedGrid);
        await new Promise(resolve => setTimeout(resolve, 100));
    };

    const RandomizeBoard = () => {
        // Clear the grid
        const updatedGrid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
        // Iterate over the columns and rows to copy the existing grid values
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                // If the current cell in the existing grid has a value, copy it; otherwise, set it to 0
                updatedGrid[i][j] = (Math.random() < drawAddChance) ? 1 : 0;
            }
        }
        setGrid(updatedGrid);
    };

    const EraseBoard = () => {
        // Clear the grid
        const updatedGrid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
        setGrid(updatedGrid);
    };



    useEffect(() => {
        resizeHandler(); // Initial setup
        window.addEventListener('resize', resizeHandler);
        console.log('new')


        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    }, []);


    useEffect(() => {
        resizeHandler();
    }, [rows]);

    useEffect(() => {
        drawGrid();
    }, [grid]);

    useEffect(() => {
        if (isMouseDown) return;
        const timeoutId = setTimeout(() => {
            updateGrid();
        }, refreshDelay);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [grid, handleMouseDown]); // Add grid as a dependency

    return (
        <>
            <SettingsMenu
                updateRadius={setRadius}
                updateRows={setRows}
                updateRefreshDelay={setRefreshDelay}
                setShowSettingsMenu={setShowSettingsMenu}
                randomizeBoard={RandomizeBoard}
                showSettingsMenu={showSettingsMenu}
                clearBoard={EraseBoard}
                drawAddChance ={drawAddChance}
                setDrawAddChance ={setDrawAddChance}
                radius={drawRadius}
                rows={rows}
                refreshDelay={refreshDelay} 
            />
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{ width: '100%', height: '100%', display: 'block' }}
            />
        </>
    );
};

export default CellularAutomaton;