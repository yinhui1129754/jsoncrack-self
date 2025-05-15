import React, { useRef, useState } from "react";
import useConfig from "src/store/useConfig";
import { getType } from "src/utils/getType";
import styled from "styled-components";
import { SlArrowRight } from "react-icons/sl";
import { Menu, MenuRef } from "antd";
import useStored from "src/store/useStored";
import copyText from "src/utils/copyText";
import toast from "react-hot-toast";


const MenuWrapper = styled.div`
    position:fixed;
    left:0;
    top:0;
    width:100%;
    height:100%;
    z-index:9999999;

`;
const ListWrapper = styled.div`
    width:320px;
    border-right:1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
    height:100%;
    box-sizing: border-box;
    position:absolute;
    top:0;
    overflow:auto;
`

const ListItem = styled.div`
    height:40px;
    line-height:40px;
    padding-left:15px;
    padding-right:15px;
    color: ${({ theme }) => theme.TEXT_NORMAL};
    display:flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    gap: 30px;
    >span{
        display:block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        min-width:30px;
        max-width:220px;
        &:first-child{
            flex-shrink: 0;

        }
    }
    &.active{
        background-color:${({ theme }) => theme.LIST_ITEM_LI_BG_ACTIVE};
    }
    &:hover{
        background-color:${({ theme }) => theme.LIST_ITEM_LI_BG_HOVER};
    }
  
`

export const List = ({ data = {}, index = -1 }: { data?: any, index?: number }) => {
    const lightmode = useStored(state => state.lightmode)
    const setListJson = useConfig(state => state.setListJson)
    const setJsonNoHooks = useConfig(state => state.setJsonNoHooks)
    const jsonObj = useConfig(state => state.jsonObj)
    const [selectData, setSelectData] = React.useState<any>({})
    const setNowSelect = useConfig(state => state.setNowSelect)

    const setChangeJson = useConfig((state) => state.setChangeJson)
    const isChangJson = useConfig(state => state.isChangJson)
    const changeJson = useConfig(state => state.changeJson)
    const listJson = useConfig(state => state.listJson)
    const [visible, setVisible] = useState(false);

    const [rect, setRect] = useState({ x: 0, y: 0, w: 0, h: 0 });

    const [rightItem, setRightItem] = useState({ key: "", obj: {} });
    const menuRef = useRef<MenuRef>(null);

    const handleClickItem = (nowData: any, index, key) => {
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
            pData: data,
            key: key
        })
        setSelectData({
            val: nowData,
            key: key
        })
    }

    const handleContext = (e: React.MouseEvent, dataItem, key, index) => {
        e.preventDefault();
        e.stopPropagation()
        setVisible(true)
        var tgNode = e.currentTarget
        if (tgNode) {

            var rect = tgNode.getBoundingClientRect()
            setRect({
                x: rect.left,
                y: rect.top,
                w: rect.width,
                h: rect.height
            })
            setRightItem({ key: key, obj: dataItem })
        }
    }

    const handleDoubleClick = (key) => {
        copyText(key).then(() => {
            toast.success("复制key成功")
        }).catch(() => {
            toast.error("复制key失败")
        })

    }
    const handleClickRightMenu = (info) => {
        setVisible(false);
        if (info.key === "1") {
            if (rightItem.key) {
                var key = rightItem.key + "copy"
                var index = 0
                while (typeof data[key] !== "undefined") {
                    index++
                    key = `${rightItem.key}_copy${index}`
                }
                data[key] = JSON.parse(JSON.stringify(rightItem.obj))
                setJsonNoHooks(JSON.stringify(jsonObj, null, 2))

                const arr: any[] = [].concat(listJson)
                setListJson(arr)
            }
        } else if (info.key === "2") {
            var key = rightItem.key
            delete data[key]
            setJsonNoHooks(JSON.stringify(jsonObj, null, 2))
            const arr: any[] = [].concat(listJson)
            setListJson(arr)
        }
    }
    React.useEffect(() => {
        setSelectData({})
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
    // 精确调整菜单位置
    React.useLayoutEffect(() => {
        if (visible && menuRef.current) {

            const menuNode = menuRef.current.menu?.list as HTMLElement;
            if (!menuNode) return;


            // 获取实际渲染后的菜单尺寸
            const menuWidth = menuNode.offsetWidth;
            const menuHeight = menuNode.offsetHeight;

            // 视口当前可见区域
            const wWidth = window.innerWidth
            const hHeight = window.innerHeight

            // 最终调整后的坐标
            let adjustedX = rect.x;
            let adjustedY = rect.y;

            // 水平方向调整
            if (rect.x > wWidth / 2) {
                adjustedX = rect.x - menuWidth; // 右侧留10px边距
            } else {
                adjustedX = rect.x + rect.w; // 左侧留10px边距
            }

            // 垂直方向调整
            if (rect.y > hHeight / 2) {
                adjustedY = rect.y - menuHeight; // 右侧留10px边距
            } else {
                adjustedY = rect.y; // 左侧留10px边距
            }
            menuNode.style.position = "absolute"
            menuNode.style.left = adjustedX + "px"
            menuNode.style.top = adjustedY + "px"

        }
    }, [visible, rect]);
    var keys = Object.keys(data)
    return (
        <ListWrapper style={{ left: (index) * 320 + "px" }}>
            {
                keys.map((key, keyIndex) => {
                    const item = data[key]
                    const type = getType(item)
                    const isActive = (selectData.val === item && selectData.key === key)
                    return (type === "array" || type === "object") ? (<ListItem onContextMenu={(e) => { handleContext(e, item, key, index) }} onDoubleClick={() => { handleDoubleClick(key) }} className={isActive ? "active" : ""} onClick={() => { handleClickItem(item, index, key) }} key={keyIndex}>
                        <span className="left">{key}</span>
                        {
                            type === "array" ? (<span className="right">{item.length}<SlArrowRight size={14} /></span>) : (<></>)
                        }
                        {
                            type === "object" ? (<span className="right">{Object.keys(item).length}<SlArrowRight size={14} /></span>) : (<></>)
                        }
                    </ListItem>) : (<ListItem className={isActive ? "active" : ""} onContextMenu={(e) => { handleContext(e, item, key, index) }} onDoubleClick={() => { handleDoubleClick(key) }} onClick={() => { handleClickItem(item, index, key) }} key={keyIndex}>
                        <span className="left2">{key}</span>
                        <span className="right2">{item}</span>
                    </ListItem>)
                })
            }
            {
                visible && (<MenuWrapper onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation()
                }} onClick={() => { setVisible(false) }}>
                    <Menu
                        ref={menuRef}
                        onClick={(info) => {
                            handleClickRightMenu(info)

                        }}
                        theme={lightmode ? "light" : "dark"} mode="inline" style={{ width: 200 }} items={[{ key: "1", label: "复制" }, { key: "2", label: "删除" }]} />
                </MenuWrapper>)
            }


        </ListWrapper>
    );
};
