import React from "react";
import toast from "react-hot-toast";
import { AiOutlineUpload } from "react-icons/ai";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import { Modal, ModalProps } from "src/components/Modal";
import useConfig from "src/store/useConfig";
import styled from "styled-components";

const StyledModalContent = styled(Modal.Content)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const StyledUploadWrapper = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
  border: 2px dashed ${({ theme }) => theme.BACKGROUND_TERTIARY};
  border-radius: 5px;
  width: 100%;
  min-height: 200px;
  padding: 16px;
  cursor: pointer;
`;

const StyledFileName = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
`;

const StyledUploadMessage = styled.h3`
  color: ${({ theme }) => theme.INTERACTIVE_ACTIVE};
  margin-bottom: 0;
`;

export const ImportModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
    const setJson = useConfig(state => state.setJson);
    const [url, setURL] = React.useState("");
    const [jsonFile, setJsonFile] = React.useState<Blob | null>(null);


    const handleSelectFile = () => {

        setJsonFile(null);
        try {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.addEventListener("change", (e) => {
                if (input.files && input.files[0]) {
                    setJsonFile(input.files[0]);
                    setTimeout(() => { handleImportFile() }, 0)
                }
            });
            setTimeout(() => input.click(), 0);
        } catch (e) {
            toast.error("导入Json失败")
        }
    };
    React.useEffect(() => {
        if (visible) {
            setURL("");
            setJsonFile(null)
        }
    }, [visible])

    const handleImportFile = () => {
        if (url) {
            setJsonFile(null);

            toast.loading("加载中...", { id: "toastFetch" });
            return fetch(url)
                .then(res => res.json())
                .then(json => {
                    setJson(JSON.stringify(json));
                    setVisible(false);
                }).catch(() => toast.error("JSON读取失败!"))
                .finally(() => toast.dismiss("toastFetch"));
        }
        if (jsonFile) {
            var reader = new FileReader()
            reader.readAsText(jsonFile, "UTF-8")
            reader.onload = () => {
                try {
                    setJson(reader.result as string);
                    setVisible(false);
                } catch (e) {
                    toast.error("JSON读取失败!");
                }
            }
            // window.readFileAsText(jsonFile).then((data) => {
            //     setJson(data as string);
            //     setVisible(false);
            // }).catch((error) => {
            //     console.error(error);
            // });
        }
    };

    return (
        <Modal visible={visible} setVisible={setVisible}>
            <Modal.Header>添加JSON</Modal.Header>
            <StyledModalContent>
                <Input
                    value={url}
                    onChange={e => setURL(e.target.value)}
                    type="url"
                    placeholder="URL或JSON"
                />
                <StyledUploadWrapper onClick={handleSelectFile}>
                    <AiOutlineUpload size={46} />
                    <StyledUploadMessage>点击上传文件</StyledUploadMessage>
                    {/* <StyledFileName>{jsonFile ?? "无文件"}</StyledFileName> */}
                </StyledUploadWrapper>
            </StyledModalContent>
            <Modal.Controls setVisible={setVisible}>
                <Button
                    status="SECONDARY"
                    onClick={handleImportFile}
                    disabled={!(jsonFile || url)}
                >
                    导入
                </Button>
            </Modal.Controls>
        </Modal>
    );
};
