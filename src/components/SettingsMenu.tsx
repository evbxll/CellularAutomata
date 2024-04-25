import { faGripHorizontal, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import Draggable from 'react-draggable';
import React, { useEffect, useRef, useState } from 'react';


const SettingsMenu: React.FC<{
  updateRadius: (value: number) => void;
  updateRows: (value: number) => void;
  updateRefreshDelay: (value: number) => void;
  clearBoard: () => void;
  setDrawAddChance: (value: number) => void;
  setShowSettingsMenu: (value: boolean) => void;
  showSettingsMenu: boolean;
  drawAddChance: number;
  radius: number;
  rows: number;
  refreshDelay: number;
}> = ({
  updateRadius,
  updateRows,
  updateRefreshDelay,
  clearBoard,
  setDrawAddChance,
  setShowSettingsMenu,
  showSettingsMenu,
  drawAddChance,
  radius,
  rows,
  refreshDelay
}) => {
    return (
      <>
        {!showSettingsMenu && (
          <button
            className="fixed top-4 right-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md transition duration-300 hover:bg-blue-600"
            onClick={() => setShowSettingsMenu(true)}
          >
            Show Settings
          </button>
        )}
        {showSettingsMenu && (
          <Draggable handle=".drag-handle">
            <div className="absolute top-10 right-10 bg-gray-200 bg-opacity-80 p-2 padding-top-0 rounded-md shadow-md font-sans">
            <div className="drag-handle w-full h-12 flex justify-center items-center cursor-move">
          <FontAwesomeIcon icon={faGripHorizontal} className="text-gray-600" />
        </div>
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowSettingsMenu(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-lg font-semibold mb-2">Settings Menu</h2>
              <div className="mb-2">
                <label className="block text-sm mb-1">Draw Radius: <span className="text-gray-500 ml-2">{radius}</span></label>
                <input type="range" min="0" max="10" value={radius} onChange={(e) => updateRadius(parseInt(e.target.value))} className="w-full appearance-none bg-gray-300 rounded-md h-5 transition-opacity duration-200 opacity-70 hover:opacity-100" />
              </div>
              <div className="mb-2">
                <label className="block text-sm mb-1"># of Rows: <span className="text-gray-500 ml-2">{rows}</span></label>
                <input type="range" min="10" max="500" value={rows} onChange={(e) => updateRows(parseInt(e.target.value))} className="w-full appearance-none bg-gray-300 rounded-md h-5 transition-opacity duration-200 opacity-70 hover:opacity-100" />
              </div>
              <div className="mb-2">
                <label className="block text-sm mb-1">Click-Draw change rate: <span className="text-gray-500 ml-2">{drawAddChance}</span></label>
                <input type="range" min="0" max="100" value={100*drawAddChance} onChange={(e) => setDrawAddChance(parseInt(e.target.value)/100)} className="w-full appearance-none bg-gray-300 rounded-md h-5 transition-opacity duration-200 opacity-70 hover:opacity-100" />
              </div>
              <div className="mb-2">
                <label className="block text-sm mb-1">Update Delay (ms): <span className="text-gray-500 ml-2">{refreshDelay}</span></label>
                <input type="range" min="0" max="1000" step="10" value={refreshDelay} onChange={(e) => updateRefreshDelay(parseInt(e.target.value))} className="w-full appearance-none bg-gray-300 rounded-md h-5 transition-opacity duration-200 opacity-70 hover:opacity-100" />
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mb-2 w-full" onClick={clearBoard}>Clear Board</button>
            </div>
          </Draggable>
        )}
      </>
    );
  }

export default SettingsMenu;
