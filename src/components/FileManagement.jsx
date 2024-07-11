import React, { useEffect, useRef, useState } from 'react';
import './FileManagement.css'; // Import the CSS file
import folderOpen from '../assets/folderOpen.svg';
import folderClose from '../assets/folderClose.svg';
import fileIcon from '../assets/fileIcon.svg';
import newFolderIcon from '../assets/newFolderIcon.svg'; // New icon for creating a new folder
import newFileIcon from '../assets/newFileIcon.svg'; // New icon for creating a new file


export default function FileManagement() {
    const [folderStructure, setFolderStructure] = useState(null);
    const [openFolders, setOpenFolders] = useState({});
    const folderSelector = useRef();

    const handleFolderSelect = (e) => {
        const files = e.target.files;
        const fileArray = Array.from(files);
        const folderTree = buildFolderTree(fileArray);

        setFolderStructure(folderTree);
    };

    const toBeOpened = useRef();

    
    const buildFolderTree = (files) => {
        const root = {};
        files.forEach((file) => {
            const parts = (file.webkitRelativePath || file.name).split('/');
            let current = root;
            parts.forEach((part, index) => {
                if (!current[part]) {
                    if (index === parts.length - 1 && !fileIsGitFolder(part)) {
                        current[part] = file;
                    } else {
                        current[part] = {};
                    }
                }
                current = current[part];
            });
        });
        return root;
    };
    
    const fileIsGitFolder = (fileName) => {
        return fileName === '.git';
    };
    
    const handleNewFolder = (folderPath) => {
        const folderName = prompt("Enter the name of the new folder:");
        if (folderName) {
            const updatedStructure = addFolderToTree(folderStructure, folderPath, folderName);
            setFolderStructure(updatedStructure);
        }
    };
    
    const handleNewFile = (folderPath) => {
        const fileName = prompt("Enter the name of the new file:");
        if (fileName) {
            const updatedStructure = addFileToTree(folderStructure, folderPath, fileName);
            setFolderStructure(updatedStructure);
        }
    };
    
    const addFolderToTree = (tree, folderPath, folderName) => {
        const parts = folderPath.split('/');
        let current = tree;
        parts.forEach((part) => {
            if (!current[part]) {
                current[part] = {};
            }
            current = current[part];
        });
        current[folderName] = {};
        return { ...tree };
    };
    
    const addFileToTree = (tree, folderPath, fileName) => {
        const parts = folderPath.split('/');
        let current = tree;
        parts.forEach((part) => {
            if (!current[part]) {
                current[part] = {};
            }
            current = current[part];
        });
        current[fileName] = new File([], fileName);
        return { ...tree };
    };
    
    const handleToggle = (e, folderPath) => {
        e.preventDefault(); // Prevent default toggle behavior
        setOpenFolders((prevState) => ({
            ...prevState,
            [folderPath]: !prevState[folderPath]
        }));
    };
    
    const renderFolderTree = (tree, folderPath = '') => {
        const items = [];
        
        Object.keys(tree).forEach((key) => {
            const value = tree[key];
            const currentPath = folderPath ? `${folderPath}/${key}` : key;
            
            if (value instanceof File) {
                items.push(
                    <li key={key} className="file-item">
                        <img src={fileIcon} alt="File" className="file-icon" /> {key}
                    </li>
                );
            } else {
                if (!fileIsGitFolder(key)) {
                    items.push(
                        <li key={key}>
                            <details open={openFolders[currentPath]}>
                                <summary className="folder-summary" onClick={(e) => handleToggle(e, currentPath)}>
                                    <img src={folderOpen} alt="Folder" className="icon-open" />
                                    <img src={folderClose} alt="Folder" className="icon" />
                                    {key}
                                    <div className="folder-actions">
                                        <img src={newFolderIcon} alt="New Folder" className="action-icon" onClick={(e) => {e.stopPropagation(); handleNewFolder(currentPath)}} />
                                        <img src={newFileIcon} alt="New File" className="action-icon" onClick={(e) => {e.stopPropagation(); handleNewFile(currentPath)}} />
                                    </div>
                                </summary>
                                <ul className="sub">{renderFolderTree(value, currentPath)}</ul>
                            </details>
                        </li>
                    );
                }
            }
        });
        
        return items;
    };
    
    useEffect(() => {
        if (toBeOpened.current) {
            // open the first details element
            toBeOpened.current.firstChild.firstChild.open = true;
        }
    });

    return (
        <>
            <div style={{ width: '16%',minWidth:"300px", height: '93.5vh', borderRight: '2px solid var(--color-4)',overflowY:'scroll' }}>
                {folderStructure ? (
                    <div className="folder">
                        <ul ref={toBeOpened} className="file-tree">
                            {renderFolderTree(folderStructure)}
                        </ul>
                    </div>
                ) : (
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <label
                            htmlFor="folderInput"
                            style={{
                                color: 'var(--color-1)',
                                backgroundColor: 'var(--color-4)',
                                padding: '8px 28px',
                                margin: '20px auto',
                                cursor: 'pointer',
                                borderRadius: '5px',
                            }}
                        >
                            Open Folder
                        </label>
                        <input
                            id="folderInput"
                            ref={folderSelector}
                            style={{ display: 'none' }}
                            type="file"
                            onChange={handleFolderSelect}
                            directory=""
                            webkitdirectory=""
                        />
                    </div>
                )}
            </div>
        </>
    );
}
