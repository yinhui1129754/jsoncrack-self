import React from "react";
import useConfig from "src/store/useConfig";
import { getType } from "src/utils/getType";
import styled from "styled-components";
import { SlArrowRight } from "react-icons/sl";


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
    &.active{
        background-color:rgba(255,255,255,0.2);
    }
    &:hover{
        background-color:rgba(255,255,255,0.1);
    }
  
`

export const List = ({ data = {}, index = -1 }: { data?: any, index?: number }) => {
    const setListJson = useConfig(state => state.setListJson)
    const [selectData, setSelectData] = React.useState<any>({})
    const setNowSelect = useConfig(state => state.setNowSelect)

    const setChangeJson = useConfig((state) => state.setChangeJson)
    const isChangJson = useConfig(state => state.isChangJson)
    const changeJson = useConfig(state => state.changeJson)
    const listJson = useConfig(state => state.listJson)
    const handleClickItem = (nowData: any, index) => {
        var type = getType(nowData)
        if ((type === "array" || type === "object")) {
            listJson.splice(index + 1)
            const arr: any[] = [].concat(listJson)
            arr.push(nowData)
            setListJson(arr)
        } else {
            listJson.splice(index + 1)
            const arr: any[] = [].concat(listJson)
            setListJson(arr)
        }
        setNowSelect({
            data: nowData,
            pData: data
        })
        setSelectData(nowData)
    }
    React.useEffect(() => {
        setSelectData(null)
    }, [data]);
    React.useEffect(() => {
        if (changeJson.newData &&
            changeJson.beforeData) {
            if (changeJson.beforeData === selectData) {
                setSelectData(changeJson.newData)
                setChangeJson({})
            }
        }
    }, [isChangJson])

    var keys = Object.keys(data)
    return (
        <ListWrapper style={{ left: (index) * 320 + "px" }}>
            {
                keys.map((key, keyIndex) => {
                    const item = data[key]
                    const type = getType(item)
                    const isActive = (selectData === item)
                    return (type === "array" || type === "object") ? (<ListItem className={isActive ? "active" : ""} onClick={() => { handleClickItem(item, index) }} key={keyIndex}>
                        <span className="left">{key}</span>
                        {
                            type === "array" ? (<span className="right">{item.length}<SlArrowRight size={14} /></span>) : (<></>)
                        }
                        {
                            type === "object" ? (<span className="right">{Object.keys(item).length}<SlArrowRight size={14} /></span>) : (<></>)
                        }
                    </ListItem>) : (<ListItem className={isActive ? "active" : ""} onClick={() => { handleClickItem(item, index) }} key={keyIndex}>
                        <span className="left2">{key}</span>
                        <span className="right2">{item}</span>
                    </ListItem>)
                })
            }
        </ListWrapper>
    );
};
