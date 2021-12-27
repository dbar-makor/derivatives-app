import React, { ChangeEvent, useEffect, useState } from "react";

import axios, { AxiosResponse, AxiosError } from "axios";

import { backendAPIAxios } from "../../../utils/http";

import { SelectChangeEvent } from "@mui/material";

import { IDerivative } from "../../../models/derivatives";

import {
  IGetDerivativeResponse,
  IGetDerivativesResponse,
  IGetFloorBrokersResponse,
} from "../../../models/response";
import { IServerResponseData } from "../../../models/shared/response";

import icons from "../../../assets/icons";

import DerivativesView from "./Derivatives.view";

interface Props {
  readonly iconName?: keyof typeof icons;
}

const Derivatives: React.FC<Props> = (
  props: React.PropsWithChildren<Props>
) => {
  const [dateState, setDateState] = useState<Date | null>(new Date());
  const [derivativesState, setDerivativesState] = useState<
    IDerivative[] | undefined
  >(undefined);
  const [derivativeState, setDerivativeState] = useState<
    IDerivative | undefined
  >(undefined);
  const [WEXState, setWEXState] = useState<boolean>(false);
  const [spinnerState, setSpinnerState] = useState<boolean>(false);
  const [uploadErrorState, setUploadErrorState] = useState<boolean>(false);
  const [openModalState, setOpenModalState] = useState<boolean>(false);
  const [CSVFileState, setCSVFileState] = useState<unknown>("");
  const [fileNameState, setFileNameState] = useState<string>("");

  const [floorBrokersDataState, setFloorBrokersDataState] = useState<
    string[] | undefined
  >([]);
  const [floorBrokersSelectState, setFloorBrokersSelectState] =
    useState<string>("");

  const floorBrokersStateChangeHandler = (event: SelectChangeEvent) => {
    setFloorBrokersSelectState(event.target.value as string);
  };

  const handleModalOpen = () => setOpenModalState(true);
  const handleModalClose = () => setOpenModalState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response: AxiosResponse<IGetFloorBrokersResponse[]> = await axios(
        "https://api.makor-x.com/reconciliation/drv_trade_floor_broker?api_key=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY3Rpb24iOiJyZWNvbmNpbGlhdGlvbiIsIm5hbWUiOiJEYW5pZWwgQmFyIn0.2hHZpM1gUw8UYUnZuczl1Jqx4ht6_UbhWosncUC67xc"
      );

      setFloorBrokersDataState(response.data.map((name) => name.name));
    };
    fetchData();
  }, [floorBrokersDataState]);

  useEffect(() => {
    getDerivatives();
  }, []);

  const getDerivatives = () => {
    backendAPIAxios
      .get("/derivatives", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token") ?? ""}`,
        },
      })
      .then((response: AxiosResponse<IGetDerivativesResponse>) => {
        if (!response.data.data) {
          return console.log("Failed to upload CSV");
        }

        setDerivativesState(() => response.data.data);
      })
      .catch((e: AxiosError) => {
        console.log(`Failed to upload CSV with error: ${e}`);
      });
  };

  const getDerivative = () => {
    backendAPIAxios
      .get("/derivatives/single", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token") ?? ""}`,
        },
      })
      .then((response: AxiosResponse<IGetDerivativeResponse>) => {
        if (!response.data.data) {
          return console.log("Failed to upload CSV");
        }

        setDerivativeState(() => response.data.data);
      })
      .catch((e: AxiosError) => {
        console.log(`Failed to upload CSV with error: ${e}`);
      });
  };

  const convertBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const file = event.target.files![0];

    if (!file) {
      console.log("error uploading file");
    }

    const base64 = await convertBase64(file);

    setCSVFileState(() => base64);

    setFileNameState(() => file.name);
    setWEXState(() => true);
  };

  const onSubmit = () => {
    setSpinnerState(() => true);

    backendAPIAxios
      .post(
        "/derivatives",
        {
          file: CSVFileState,
          date: dateState,
          floorBrokers: floorBrokersSelectState,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") ?? ""}`,
          },
        }
      )
      .then((response: AxiosResponse<IServerResponseData>) => {
        if (!response.data) {
          return console.log("Failed to upload CSV");
        }

        if (response.status === 200) {
          getDerivatives();
          getDerivative();
        }
      })
      .catch((e: AxiosError) => {
        console.log(`Failed to upload CSV with error: ${e}`);
        setUploadErrorState(() => true);
        setTimeout(() => {
          setUploadErrorState(() => false);
        }, 2000);
      })
      .finally(() => {
        setSpinnerState(() => false);
        setWEXState(() => false);
        setCSVFileState(() => undefined);
      });
  };

  const onDownload = (fileName: string) => {
    backendAPIAxios
      .get("/derivatives/download/" + fileName, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token") ?? ""}`,
        },
      })
      .then((response: AxiosResponse) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
      })
      .catch((e: AxiosError) => {
        console.log(`Failed to download file with error: ${e}`);
      });
  };

  return (
    <DerivativesView
      iconName={props.iconName}
      derivativesState={derivativesState}
      derivativeState={derivativeState}
      WEXState={WEXState}
      spinnerState={spinnerState}
      uploadErrorState={uploadErrorState}
      openModalState={openModalState}
      dateState={dateState}
      setDateState={setDateState}
      handleModalOpen={handleModalOpen}
      handleModalClose={handleModalClose}
      floorBrokersSelectState={floorBrokersSelectState}
      floorBrokersDataState={floorBrokersDataState}
      floorBrokersSelectChangeHandler={floorBrokersStateChangeHandler}
      fileNameState={fileNameState}
      onUpload={onUpload}
      onSubmit={onSubmit}
      onDownload={onDownload}
    >
      {props.children}
    </DerivativesView>
  );
};

Derivatives.displayName = "Derivatives";
Derivatives.defaultProps = {};

export default Derivatives;
function componentDidMount() {
  throw new Error("Function not implemented.");
}
