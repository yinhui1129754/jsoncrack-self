import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { defaultJson } from "src/constants/data";
import create from "zustand";

interface ConfigActions {
  setJson: (json: string) => void;
  setConfig: (key: keyof Config, value: unknown) => void;
  getJson: () => string;
  zoomIn: () => void;
  zoomOut: () => void;
  centerView: () => void;
  getJsonObj: () => any;
  setJsonObj: (jsonObj: any) => any;
  getListJson: () => any;
  setListJson: (listJson: any) => any;

  getNowSelect: () => any;
  setNowSelect: (nowSelectData: any) => any;
  checkIsChangJson: () => any;
  setChangeJson: (j) => any
}

const initialStates = {
  // 编辑的json字符串
  json: defaultJson,
  // 编辑的json对象
  jsonObj: {},

  // 列表模式下的json列表 对象
  listJson: [] as any,
  // 列表模式下选中的json数据
  nowSelectData: {} as any,

  /**
   * 编辑器修改json
   */
  isChangJson: false,

  changeJson: {} as any,



  cursorMode: "move" as "move" | "navigation",
  foldNodes: false,
  hideEditor: false,
  performanceMode: true,
  disableLoading: false,
  zoomPanPinch: undefined as ReactZoomPanPinchRef | undefined
};

export type Config = typeof initialStates;

const useConfig = create<Config & ConfigActions>()((set, get) => ({
  ...initialStates,
  getJson: () => get().json,
  setJson: (json: string) => set({ json }),
  getJsonObj: () => get().jsonObj,
  getNowSelect: () => get().nowSelectData,
  checkIsChangJson: () => set({ isChangJson: !get().isChangJson }),

  setNowSelect: (nowSelectData) => {
    return set({ nowSelectData: nowSelectData })
  },
  getListJson: () => get().listJson,
  setChangeJson: (j) => {
    return set({ changeJson: j })
  },
  setListJson: (listJson) => {
    return set({ listJson: listJson })
  },
  setJsonObj: (jsonObj) => {
    return set({ jsonObj: jsonObj })
  },
  zoomIn: () => {
    const zoomPanPinch = get().zoomPanPinch;
    if (zoomPanPinch) {
      zoomPanPinch.setTransform(
        zoomPanPinch?.state.positionX,
        zoomPanPinch?.state.positionY,
        zoomPanPinch?.state.scale + 0.4
      );
    }
  },
  zoomOut: () => {
    const zoomPanPinch = get().zoomPanPinch;
    if (zoomPanPinch) {
      zoomPanPinch.setTransform(
        zoomPanPinch?.state.positionX,
        zoomPanPinch?.state.positionY,
        zoomPanPinch?.state.scale - 0.4
      );
    }
  },
  centerView: () => {
    const zoomPanPinch = get().zoomPanPinch;
    const canvas = document.querySelector(".jsoncrack-canvas") as HTMLElement;
    if (zoomPanPinch && canvas) zoomPanPinch.zoomToElement(canvas);
  },
  setConfig: (setting: keyof Config, value: unknown) => set({ [setting]: value }),
}));

export default useConfig;
