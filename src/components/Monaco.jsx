import { Editor } from '@monaco-editor/react'
import React from 'react'
import Loader from './Loader';

export default function Monaco({code, language}) {

  const extensionToLanguage = {
    "c": "c",
    "cpp": "cpp",
    "h": "c header",
    "hpp": "c++ header",
    "cs": "c#",
    "java": "java",
    "py": "python",
    "js": "javascript",
    "ts": "typescript",
    "php": "php",
    "rb": "ruby",
    "go": "go",
    "svg":"html",
    "rs": "rust",
    "swift": "swift",
    "dart": "dart",
    "html": "html",
    "css": "css",
    "scss": "scss",
    "less": "less",
    "sql": "sql",
    "json": "json",
    "xml": "xml",
    "yaml": "yaml",
    "markdown": "markdown",
    "lua": "lua",
    "perl": "perl",
    "r": "r",
    "rust": "rust",
    "vb": "visual basic",
    "asm": "assembly",
    "pl": "prolog",
    "jsx": "javascript",
    "tsx": "typescript",
    "sh": "shell script",
    "bat": "batch script",
    "coffee": "coffeescript",
    "scala": "scala",
    "groovy": "groovy",
    "kotlin": "kotlin",
    "ejs": "ejs (embedded javascript)",
    "erb": "erb (embedded ruby)",
    "jade": "jade",
    "handlebars": "handlebars",
    "twig": "twig",
    "pug": "pug",
    "jsp": "java server pages (jsp)",
    "asp": "active server pages (asp)",
    "vbhtml": "razor (vbhtml)",
    "dust": "dust",
    "hbs": "handlebars",
    "mustache": "mustache",
    "cshtml": "razor",
    "md": "markdown",
    "fs": "fsharp",
    "ps1": "powershell",
    "sass": "sass",
    "m": "objective-c",
    '':'text'
  };

  language = extensionToLanguage[language]
  // language = language.toLowerCase()


  return (
    <>
        <Editor height="60%"  defaultLanguage={language} loading={<Loader/>} defaultValue={code} options={FontFace="fira code"} theme='vs-dark'   />
    </>
  )
}
