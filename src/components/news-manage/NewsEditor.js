//引入react
import React, { useEffect, useState } from 'react'
//引入react-draft-wysiwyg
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
//引入draftjs-to-html
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

export default function NewsEditor(props) {

    //将原型数据转为去标签数据
    useEffect(() => {
        const html = props.content
        if(html===undefined) return
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    },[props.content])

    //定义文本内容
    const [editorState, setEditorState] = useState("")

    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => setEditorState(editorState)}
                //失去焦点时转换文本内容为html格式
                onBlur={() => {
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))

                }}
            />
        </div>
    )
}
