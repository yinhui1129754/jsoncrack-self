import React from "react";
import { toBlob, toPng } from "html-to-image";
import { TwitterPicker } from "react-color";
import { TwitterPickerStylesProps } from "react-color/lib/components/twitter/Twitter";
import toast from "react-hot-toast";
import { FiCopy, FiDownload } from "react-icons/fi";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import { Modal, ModalProps } from "src/components/Modal";
import useConfig from "src/store/useConfig";
import styled from "styled-components";

const ColorPickerStyles: Partial<TwitterPickerStylesProps> = {
    card: {
        background: "transparent",
        boxShadow: "none",
    },
    body: {
        padding: 0,
    },
    input: {
        background: "rgba(0, 0, 0, 0.2)",
        boxShadow: "none",
        textTransform: "none",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    },
    hash: {
        background: "rgba(180, 180, 180, 0.3)",
    },
};

const defaultColors = [
    "#B80000",
    "#DB3E00",
    "#FCCB00",
    "#008B02",
    "#006B76",
    "#1273DE",
    "#004DCF",
    "#5300EB",
    "#EB9694",
    "#FAD0C3",
    "#FEF3BD",
    "#C1E1C5",
    "#BEDADC",
    "#C4DEF6",
    "#BED3F3",
    "#D4C4FB",
    "transparent",
];

const downloadImgState = {
    bool: true,
}

function downloadImg(blob: Blob, name: string) {
    if (downloadImgState.bool) {
        downloadImgState.bool = false;
        try {
            // let path = utools.showSaveDialog({
            //     title: '保存位置',
            //     defaultPath: utools.getPath('downloads') + "/" + name,
            //     buttonLabel: '保存',
            //     properties: ['createDirectory']
            // }) as string;
            // if(path) {
            //     window.savaImageToFile(path, blob).then(() => {
            //         toast.success("保存完成");
            //     }).catch((e) => {
            //         throw new Error(e);
            //     });
            // }
        } catch (e) {
            downloadImgState.bool = true;
        }
    }
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};

  &:first-of-type {
    padding-top: 0;
    border: none;
  }
`;

const StyledColorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledColorIndicator = styled.div<{ color: string }>`
  flex: 1;
  width: 100%;
  height: auto;
  border-radius: 6px;
  background: ${({ color }) => color};
  border: 1px solid;
  border-color: rgba(0, 0, 0, 0.1);
`;

export const DownloadModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
    const setConfig = useConfig(state => state.setConfig);
    const [fileDetails, setFileDetails] = React.useState({
        filename: "json_image",
        backgroundColor: "transparent",
        quality: 1,
    });

    const clipboardImage = async () => {
        try {
            toast.loading("复制到剪切板...", { id: "toastClipboard" });
            setConfig("performanceMode", false);

            const imageElement = document.querySelector("svg[id*='ref']") as HTMLElement;

            const imgElement = await toPng(imageElement, {
                quality: fileDetails.quality,
                backgroundColor: fileDetails.backgroundColor,
            });
            if (!imgElement) return;
            // utools.copyImage(imgElement)
            toast.success("复制成功");
        } catch (error) {
            toast.error("复制成功失败");
        } finally {
            toast.dismiss("toastClipboard");
            setVisible(false);
            setConfig("performanceMode", true);
        }
    };

    const exportAsImage = async () => {
        try {
            toast.loading("下载中...", { id: "toastDownload" });
            setConfig("performanceMode", false);

            const imageElement = document.querySelector("svg[id*='ref']") as HTMLElement;

            const blob = await toBlob(imageElement, {
                quality: fileDetails.quality,
                backgroundColor: fileDetails.backgroundColor,
            });
            if (blob != null) {
                downloadImg(blob, `${fileDetails.filename}.png`);
            }
        } catch (error) {
            toast.error("图片下载失败!");
        } finally {
            toast.dismiss("toastDownload");
            setVisible(false);
            setConfig("performanceMode", true);
        }
    };

    const updateDetails = (key: keyof typeof fileDetails, value: string | number) =>
        setFileDetails({ ...fileDetails, [key]: value });

    return (
        <Modal visible={visible} setVisible={setVisible}>
            <Modal.Header>下载图片</Modal.Header>
            <Modal.Content>
                <StyledContainer>
                    文件名
                    <StyledColorWrapper>
                        <Input
                            placeholder="文件名e"
                            value={fileDetails.filename}
                            onChange={e => updateDetails("filename", e.target.value)}
                        />
                    </StyledColorWrapper>
                </StyledContainer>
                <StyledContainer>
                    背景颜色
                    <StyledColorWrapper>
                        <TwitterPicker
                            triangle="hide"
                            colors={defaultColors}
                            color={fileDetails.backgroundColor}
                            onChange={color => updateDetails("backgroundColor", color.hex)}
                            styles={{
                                default: ColorPickerStyles,
                            }}
                        />
                        <StyledColorIndicator color={fileDetails.backgroundColor} />
                    </StyledColorWrapper>
                </StyledContainer>
            </Modal.Content>
            <Modal.Controls setVisible={setVisible}>
                <Button status="SECONDARY" onClick={clipboardImage}>
                    <FiCopy size={16} /> 复制
                </Button>
                <Button status="SUCCESS" onClick={exportAsImage}>
                    <FiDownload size={16} />
                    下载
                </Button>
            </Modal.Controls>
        </Modal>
    );
};
