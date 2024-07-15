import { useEffect, useRef, useState } from 'react';
import './FileManagement.css'; // Import the CSS file
import folderOpen from '../assets/folderOpen.svg';
import folderClose from '../assets/folderClose.svg';
import fileIcon from '../assets/fileIcon.svg';
import newFolderIcon from '../assets/newFolderIcon.svg'; // New icon for creating a new folder
import newFileIcon from '../assets/newFileIcon.svg'; // New icon for creating a new file
import Monaco from './Monaco';
import {Panel,PanelGroup,PanelResizeHandle} from 'react-resizable-panels';

export default function FileManagement() {
    const [folderStructure, setFolderStructure] = useState(null);
    const [openFolders, setOpenFolders] = useState({});
    const [currentFileContent, setCurrentFileContent] = useState('');
    const [currentFilePath, setCurrentFilePath] = useState('');
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
        e.preventDefault(); 
        setOpenFolders((prevState) => ({
            ...prevState,
            [folderPath]: !prevState[folderPath]
        }));
    };

    const editorArea = useRef();

    const [fileTabs, setFileTabs] = useState([]);

    const fileOpen = (e) => {
        const path = e.target.getAttribute('currentpath');
        if (!fileTabs.includes(path)) {
            setFileTabs([...fileTabs, path]);
        }
        showFileData(path);
    };

    const renderFolderTree = (tree, folderPath = '') => {
        const items = [];

        Object.keys(tree).forEach((key) => {
            const value = tree[key];
            const currentpath = folderPath ? `${folderPath}/${key}` : key;

            if (value instanceof File) {
                items.push(
                    <li key={key} currentpath={currentpath} className="file-item" onClick={fileOpen}>
                        <img src={fileIcon} alt="File" className="file-icon" /> {key}
                    </li>
                );
            } else {
                if (!fileIsGitFolder(key)) {
                    items.push(
                        <li key={key}>
                            <details open={openFolders[currentpath]}>
                                <summary className="folder-summary" onClick={(e) => handleToggle(e, currentpath)}>
                                    <img src={folderOpen} alt="Folder" className="icon-open" />
                                    <img src={folderClose} alt="Folder" className="icon" />
                                    {key}
                                    <div className="folder-actions">
                                        <img src={newFolderIcon} alt="New Folder" className="action-icon" onClick={(e) => { e.stopPropagation(); handleNewFolder(currentpath) }} />
                                        <img src={newFileIcon} alt="New File" className="action-icon" onClick={(e) => { e.stopPropagation(); handleNewFile(currentpath) }} />
                                    </div>
                                </summary>
                                <ul className="sub">{renderFolderTree(value, currentpath)}</ul>
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
            toBeOpened.current.firstChild.firstChild.open = true;
        }
    });

    const closeFile = (e) => {
        e.stopPropagation(); // Prevent the click event from bubbling up
        const path = e.target.getAttribute('currentpath');

        const newTabs = fileTabs.filter((tab) => {
            return tab !== path;
        });

        if (currentFilePath === path && newTabs.length > 0) {
            showFileData(newTabs[newTabs.length - 1]);
        }
        else if(newTabs.length === 0) {
            setCurrentFileContent('');
            setCurrentFilePath('');
        }

        setFileTabs(newTabs);
    };

    const showFileData = (path) => {
        const file = folderStructure;
        const parts = path.split('/');
        let current = file;
        parts.forEach((part) => {
            current = current[part];
        });

        if (current instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCurrentFileContent(e.target.result);
                setCurrentFilePath(path);
            };
            reader.readAsText(current);
        } else {
            setCurrentFileContent('');
            setCurrentFilePath('');
        }
    };


    // get the element whose currentpath attribute matches the currentFilePath state
    useEffect(()=>{
        const tabs = document.querySelectorAll('.tabs');
        tabs.forEach(tab => {
            if(tab.getAttribute('currentpath') === currentFilePath){
                tab.style.backgroundColor = 'var(--color-4)';
                tab.style.color = 'var(--color-1)';
            }else{
                tab.style.backgroundColor = 'var(--color-3)';
                tab.style.color = 'var(--color-4)';
            }
        })
    })


    return (
        <>
            <div className="middle">
            <PanelGroup autoSaveId='example' direction='horizontal'>

            <Panel minSize={10} defaultSize={20}>
                <div style={{ height: '94vh', overflowY: 'scroll' }}>
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

                </Panel>
                
                <PanelResizeHandle/>
                <Panel>

                {fileTabs.length > 0 && <>
                    <div ref={editorArea}>
                    <PanelGroup style={{height:'94vh'}} direction='vertical'>
                        <Panel>
                            <div className="filetabnav">
                                {fileTabs.map((fileName) => {
                                    return (
                                        <button className='tabs' key={fileName} style={{ padding: '6px 15px', backgroundColor: 'var(--color-4)', color: 'var(--color-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight: '1px', fontSize: '14px', cursor: 'pointer', border: 'none', outline: 'none' }} currentpath={fileName} onClick={() => showFileData(fileName)}>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: 'max-content' }}>{fileName.split('/').pop()}</div>
                                                <span style={{ fontSize: '11px', margin: '0 4px', color: 'var(--color-4)', padding: '3px 8px', backgroundColor: 'var(--color-3)', borderRadius: '5px', width: 'max-content' }}>{fileName.split('/').slice(1, -1).join('/')}/</span>
                                            </div>
                                            <span style={{ fontWeight: 900, marginLeft: '15px' }} currentpath={fileName} onClick={closeFile}>✕</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {currentFilePath && <Monaco key={currentFilePath} code={currentFileContent} language={currentFilePath.split('.').pop()} />}
                        </Panel>

                        <PanelResizeHandle style={{height:'1px',backgroundColor:'var(--color-4)'}}/>

                        <Panel defaultSize={25} style={{borderLeft:'1px solid var(--color-4)'}}>
                            <div className="terminal-nav">
                                <div className="left">
                                    <a style={{fontSize:'12px'}} href="">PROBLEM</a>
                                    <a style={{fontSize:'12px'}} href="">TERMINAL</a>
                                    <a style={{fontSize:'12px'}} href="">CHAT</a>
                                </div>
                                <div className="right">
                                    <span style={{display:'flex',alignItems:'center',justifyContent:'center'}}><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" version="1.0" viewBox="0.0 0.0 19.0 19.0" zoomAndPan="magnify" style={{fill: "rgb(142, 150, 189)"}} original_string_length="441"><g data-name="Layer 2"><g data-name="Layer 1" id="__id121_s8dey1ljvr"><path d="M18.5,9H10V.5a.5.5,0,0,0-1,0V9H.5a.5.5,0,0,0,0,1H9v8.5a.5.5,0,0,0,1,0V10h8.5a.5.5,0,0,0,0-1Z" style={{fill: "inherit"}}></path></g></g></svg> bash</span>

                                    <span><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" data-name="Layer 41" preserveAspectRatio="xMidYMid meet" version="1.0" viewBox="4.0 2.0 42.0 46.0" zoomAndPan="magnify" style={{fill: "rgb(142, 150, 189)"}} original_string_length="869"><g id="__id125_s8dey1ljvr"><path d="M44,10H35V8.59A6.6,6.6,0,0,0,28.41,2H21.59A6.6,6.6,0,0,0,15,8.59V10H6a2,2,0,0,0,0,4H9V41.38A6.63,6.63,0,0,0,15.63,48H34.38A6.63,6.63,0,0,0,41,41.38V14h3A2,2,0,0,0,44,10ZM19,8.59A2.59,2.59,0,0,1,21.59,6h6.82A2.59,2.59,0,0,1,31,8.59V10H19V8.59ZM37,41.38A2.63,2.63,0,0,1,34.38,44H15.63A2.63,2.63,0,0,1,13,41.38V14H37V41.38Z"style={{fill: "inherit"}}></path></g><g id="__id126_s8dey1ljvr"><path d="M20,18.49a2,2,0,0,0-2,2v18a2,2,0,0,0,4,0v-18A2,2,0,0,0,20,18.49Z" style={{fill: "inherit"}}></path></g><g id="__id127_s8dey1ljvr"><path d="M30,18.49a2,2,0,0,0-2,2v18a2,2,0,1,0,4,0v-18A2,2,0,0,0,30,18.49Z" style={{fill: "inherit"}}></path></g></svg></span>

                                    <span style={{fontSize:'18px'}}>✕</span>
                                </div>
                            </div>
                        </Panel>
                    </PanelGroup>
                </div>
                </>}
            </Panel>
            </PanelGroup>

            </div>
        </>
    );
}
