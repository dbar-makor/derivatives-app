import React, { ChangeEvent, useEffect, useState } from "react";

import { AxiosResponse, AxiosError } from "axios";

import { backendAPIAxios } from "../../../utils/http";

import { SelectChangeEvent } from "@mui/material";

import { convertBase64 } from "../../../utils/derivatives";
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
  const [CSVFileState, setCSVFileState] = useState<unknown>("");

  const [fileNameState, setFileNameState] = useState<string>("");
  const [floorBrokersDataState, setFloorBrokersDataState] = useState<
    IGetFloorBrokersResponse[] | undefined
  >([]);
  const [floorBrokerSelectState, setFloorBrokersSelectState] =
    useState<string>("");

  const [WEXState, setWEXState] = useState<boolean>(false);
  const [spinnerState, setSpinnerState] = useState<boolean>(false);
  const [uploadErrorState, setUploadErrorState] = useState<boolean>(false);
  const [openModalState, setOpenModalState] = useState<boolean>(false);
  const [disableFloorBrokersSelectState, setdisableFloorBrokersSelectState] =
    useState<boolean>(true);
  const [submitState, setSubmitState] = useState<boolean>(false);

  const handleModalOpen = () => setOpenModalState(true);
  const handleModalClose = () => setOpenModalState(false);
  const floorBrokersStateChangeHandler = (event: SelectChangeEvent) => {
    setFloorBrokersSelectState(event.target.value as string);
  };

  useEffect(() => {
    getDerivatives();
    getFloorBrokers();
  }, []);

  useEffect(() => {
    if (CSVFileState && floorBrokerSelectState) {
      setSubmitState(() => true);
    }
  }, [CSVFileState, floorBrokerSelectState]);

  const getFloorBrokers = async () => {
    await backendAPIAxios
      .get(
        `${process.env.REACT_APP_MAKOR_X_URL}${process.env.REACT_APP_MAKOR_X_API_KEY}`
      )
      .then((response: AxiosResponse<IGetFloorBrokersResponse[]>) => {
        if (!response.data) {
          return alert("Failed to upload CSV");
        }

        if (response.status === 200) {
          setdisableFloorBrokersSelectState(() => false);
        }

        setFloorBrokersDataState(() => response.data);
      })
      .catch((e: AxiosError) => {
        alert(`Failed to upload CSV with error: ${e}`);
      });
  };

  const getDerivatives = () => {
    backendAPIAxios
      .get("/derivatives", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token") ?? ""}`,
        },
      })
      .then((response: AxiosResponse<IGetDerivativesResponse>) => {
        if (!response.data.data) {
          return alert("Failed to upload CSV");
        }

        setDerivativesState(() => response.data.data);
      })
      .catch((e: AxiosError) => {
        alert(`Failed to upload CSV with error: ${e}`);
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
          return alert("Failed to upload CSV");
        }

        setDerivativeState(() => response.data.data);
      })
      .catch((e: AxiosError) => {
        alert(`Failed to upload CSV with error: ${e}`);
      });
  };

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const file = event.target.files![0];

    if (!file) {
      alert("error uploading file");
    }

    if (file && floorBrokerSelectState) {
      setSubmitState(() => true);
    }

    const base64 = await convertBase64(file);

    setCSVFileState(() => base64);
    setFileNameState(() => file.name);
    setWEXState(() => true);
  };

  const onSubmit = () => {
    setSpinnerState(() => true);

    if (derivativeState) {
      setDerivativeState(() => undefined);
    }

    backendAPIAxios
      .post(
        "/derivatives",
        {
          file: CSVFileState,
          name: fileNameState,
          date: dateState,
          floorBrokerID: floorBrokerSelectState,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") ?? ""}`,
          },
        }
      )
      .then((response: AxiosResponse<IServerResponseData>) => {
        if (!response.data) {
          return alert("Failed to upload CSV");
        }

        if (response.status === 200) {
          getDerivatives();
          getDerivative();
        }
      })
      .catch((e: AxiosError) => {
        alert(`Failed to upload CSV with error: ${e}`);
        setUploadErrorState(() => true);
        setTimeout(() => {
          setUploadErrorState(() => false);
        }, 2000);
      })
      .finally(() => {
        setSpinnerState(() => false);
        setWEXState(() => false);
        setCSVFileState(() => undefined);
        setFloorBrokersSelectState(() => "");
        setFileNameState(() => "");
        setSubmitState(() => false);
      });
  };

  const onDownload = async (fileName: string) => {
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
        alert(`Failed to download file with error: ${e}`);
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
      floorBrokerSelectState={floorBrokerSelectState}
      floorBrokersDataState={floorBrokersDataState}
      floorBrokersSelectChangeHandler={floorBrokersStateChangeHandler}
      disableFloorBrokersSelectState={disableFloorBrokersSelectState}
      fileNameState={fileNameState}
      submitState={submitState}
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
