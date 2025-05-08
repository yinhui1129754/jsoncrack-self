import React from "react";
import useConfig from "src/store/useConfig";
import { getType } from "src/utils/getType";
import styled from "styled-components";



const ListWrapper = styled.div`
    width:320px;
    border-right:1px solid #475569;
    height:100%;
    box-sizing: border-box;
    position:absolute;
    top:0;
`

const ListItem = styled.div`
    height:40px;
    line-height:40px;
    padding-left:15px;
    padding-right:15px;
    color:rgb(148, 163, 184);
    display:flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    >span{
        display:block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        min-width:30px;
    }
    &:hover{
        background-color:rgba(255,255,255,0.1);
    }
  
`

export const List = ({ data = {}, index = -1 }: { data?: any, index?: number }) => {
    const setListJson = useConfig(state => state.setListJson)

    var listJson = useConfig(state => state.listJson)
    const handleClickItem = (data: any, index) => {
        var type = getType(data)
        if ((type === "array" || type === "object")) {
            listJson.splice(index + 1)
            const arr: any = [].concat(listJson)
            arr.push(data)
            setListJson(arr)
        }
    }
    var keys = Object.keys(data)
    return (
        <ListWrapper style={{ left: (index) * 320 + "px" }}>
            {
                keys.map((key, keyIndex) => {
                    var item = data[key]
                    var type = getType(item)
                    return (type === "array" || type === "object") ? (<ListItem onClick={() => { handleClickItem(item, index) }} key={keyIndex}>
                        <span className="left">{key}</span>
                        {
                            type === "array" ? (<span className="right">{item.length}&gt;</span>) : (<></>)
                        }
                        {
                            type === "object" ? (<span className="right">{Object.keys(item).length}&gt;</span>) : (<></>)
                        }
                    </ListItem>) : (<ListItem onClick={() => { handleClickItem(item, index) }} key={keyIndex}>
                        <span className="left2">{key}</span>
                        <span className="right2">{item}</span>
                    </ListItem>)
                })
            }
        </ListWrapper>
    );
};
