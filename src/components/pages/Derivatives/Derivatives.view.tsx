import React, { ChangeEvent } from "react";

import icons from "../../../assets/icons";

import Svg from "../../ui/Svg/Svg";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { IDerivative } from "../../../models/derivatives";

import classes from "./Derivatives.module.scss";
import { IGetFloorBrokersResponse } from "../../../models/response";

interface Props {
  readonly iconName?: keyof typeof icons;
  readonly setDateState: React.Dispatch<React.SetStateAction<Date | null>>;
  readonly floorBrokersSelectChangeHandler: (event: SelectChangeEvent) => void;
  readonly onUpload: (value: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onDownload: (event: string) => void;
  readonly handleModalClose: () => void;
  readonly handleModalOpen: () => void;
  readonly floorBrokersDataState?: IGetFloorBrokersResponse[];
  readonly derivativesState?: IDerivative[];
  readonly derivativeState?: IDerivative;
  readonly floorBrokerSelectState: string;
  readonly spinnerTimerState?: number;
  readonly dateState: Date | null;
  readonly fileNameState: string;
  readonly WEXState: boolean;
  readonly spinnerState: boolean;
  readonly uploadErrorState: boolean;
  readonly openModalState: boolean;
  readonly disableFloorBrokersSelectState: boolean;
  readonly submitState: boolean;
  readonly completeState: boolean;
}

const DerivativesView: React.FC<Props> = (
  props: React.PropsWithChildren<Props>
) => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 780,
    height: 920,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className={classes["container"]}>
      <nav className={classes["nav"]}>
        <div className={classes["innerNav"]}>
          <span className={classes["navHeader"]}>History</span>
          {!props.derivativesState ? (
            ""
          ) : (
            <Button
              className={classes["navLinkButton"]}
              onClick={props.handleModalOpen}
            >
              NEW RECONCILIATION
            </Button>
          )}
        </div>
      </nav>
      <TableContainer component={Paper}>
        <Table
          sx={{
            justifyContent: "center",
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: 1500,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center" className={classes["tableCellHeader"]}>
                Username
              </TableCell>
              <TableCell className={classes["tableCellHeader"]}>Date</TableCell>
              <TableCell className={classes["tableCellHeader"]}>WEX</TableCell>
              <TableCell className={classes["tableCellHeader"]} align="center">
                Matched
              </TableCell>
              <TableCell className={classes["tableCellHeader"]} align="center">
                Unmatched
              </TableCell>
              <TableCell className={classes["tableCellHeader"]} align="center">
                Complete
              </TableCell>
              <TableCell className={classes["tableCellHeader"]}>
                Derivatives
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.derivativesState &&
              props.derivativesState.map((row) => (
                <TableRow key={row.id}>
                  <TableCell
                    style={{ color: "#3E2F71", fontWeight: 700 }}
                    align="center"
                  >
                    {row.username}
                  </TableCell>
                  <TableCell style={{ color: "#8a8a8a", fontWeight: 700 }}>
                    {row.date}
                  </TableCell>
                  <TableCell className={classes["hi"]}>
                    <Svg className={classes["attachSvg"]} name="attach" />
                    <button
                      className={classes["downloadButton"]}
                      onClick={() => props.onDownload(row.wex)}
                    >
                      {row.wex}
                    </button>
                  </TableCell>
                  <TableCell
                    style={{ color: "#238D38", fontWeight: 700 }}
                    align="center"
                  >
                    {row.matchedCount}
                  </TableCell>
                  <TableCell
                    style={{ color: "#E59813", fontWeight: 700 }}
                    align="center"
                  >
                    {row.unmatchedCount}
                  </TableCell>
                  <TableCell
                    style={{ color: "#3E2F71", fontWeight: 700 }}
                    align="center"
                  >
                    {row.matchedSumPercentage === 100 ? (
                      <Svg style={{ marginRight: 5 }} name="complete" />
                    ) : (
                      `${row.matchedSumPercentage}%`
                    )}
                  </TableCell>
                  <TableCell align="left">
                    <Svg name="attach" />
                    <button
                      className={classes["downloadButton"]}
                      onClick={() => props.onDownload(row.unresolved)}
                    >
                      {row.unresolved}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={props.openModalState} onClose={props.handleModalClose}>
        <Box sx={style}>
          <span className={classes["modalHeader"]}>
            Derivatives reconciliation
          </span>
          {!props.spinnerState ? (
            <div className={classes["uploadFilesContainer"]}>
              <div className={classes["uploadFilesContainer__headers"]}>
                <span
                  className={classes["uploadFilesContainer__headers--header"]}
                >
                  1. Upload Files
                </span>
                <span
                  className={classes["uploadFilesContainer__headers--content"]}
                >
                  Upload source, choose Floor Broker and Date
                </span>
              </div>
              {!props.uploadErrorState ? (
                <form
                  className={classes["uploadFilesContainer__form"]}
                  onSubmit={props.onSubmit}
                >
                  <div className={classes["buttonContainer"]}>
                    {!props.WEXState ? (
                      <Button className={classes["buttonContainer__button"]}>
                        <label>
                          <Svg
                            className={classes["addFileSvg"]}
                            name="addFile"
                          />
                          <input
                            style={{ display: "none" }}
                            onChange={props.onUpload}
                            type="file"
                            accept=".csv"
                            name="csv"
                          />
                        </label>
                      </Button>
                    ) : (
                      <Button
                        disabled
                        className={classes["buttonContainer__buttonUploaded"]}
                      >
                        <label>
                          <Svg
                            className={classes["addFileSvg"]}
                            name="fileUploaded"
                          />
                        </label>
                      </Button>
                    )}
                    <span className={classes["buttonContainer__text"]}>
                      {!props.fileNameState
                        ? "File Name"
                        : props.fileNameState.substring(0, 21)}
                    </span>
                  </div>
                  <div className={classes["selectContainer"]}>
                    <Box sx={{ minWidth: 260 }}>
                      <FormControl fullWidth>
                        <InputLabel id="floorBrolersSelectLabel">
                          Floor Broker
                        </InputLabel>
                        {props.disableFloorBrokersSelectState ? (
                          <Select
                            disabled
                            label="Floor Broker"
                            defaultValue=""
                          ></Select>
                        ) : (
                          <Select
                            labelId="floorBrolersSelectLabel"
                            id="floorBrolersSelect"
                            defaultValue=""
                            value={props.floorBrokerSelectState}
                            label="Floor Broker"
                            onChange={props.floorBrokersSelectChangeHandler}
                          >
                            {props.floorBrokersDataState?.map(
                              ({ name }, index) => {
                                return (
                                  <MenuItem key={index} value={name}>
                                    {name}
                                  </MenuItem>
                                );
                              }
                            )}
                          </Select>
                        )}
                      </FormControl>
                    </Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Box m={2}>
                        <DatePicker
                          inputFormat="yyyy-MM"
                          views={["year", "month"]}
                          label="Year and Month"
                          minDate={new Date("2021-01")}
                          maxDate={new Date()}
                          value={props.dateState}
                          onChange={props.setDateState}
                          renderInput={(params) => (
                            <TextField
                              style={{ border: "red" }}
                              {...params}
                              helperText={null}
                            />
                          )}
                        />
                      </Box>
                    </LocalizationProvider>
                    {props.submitState ? (
                      <Button
                        className={classes["submitReconciliation"]}
                        type="submit"
                        onSubmit={props.onSubmit}
                      >
                        Submit
                      </Button>
                    ) : (
                      <Button
                        className={classes["submitReconciliationDisabled"]}
                        disabled
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                </form>
              ) : (
                <div className={classes["uploadFilesContainer__error"]}>
                  Error uploading files - Please try again
                </div>
              )}
            </div>
          ) : (
            <div className={classes["uploadFilesSpinnerContainer"]}>
              <CircularProgress
                style={{ color: "#3E2F72", padding: 68 }}
                size={150}
              />
            </div>
          )}
          <div className={classes["derivativesContainer"]}>
            <div className={classes["derivativesContainer__headers"]}>
              <span
                className={classes["derivativesContainer__headers--header"]}
              >
                2. Derivatives
              </span>
              <span
                className={classes["derivativesContainer__headers--content"]}
              >
                Summary after reconciliation
              </span>
            </div>
            <div className={classes["derivativesTableContainer"]}>
              <div className={classes["derivativesTableContainer__table"]}>
                <div className={classes["derivativesTableContainer__text"]}>
                  <div
                    className={
                      classes["derivativesTableContainer__text--matchedRows"]
                    }
                  >
                    Name
                  </div>
                  <div
                    className={
                      classes["derivativesTableContainer__text--matchedRows"]
                    }
                  >
                    Total Count
                  </div>
                  <div
                    className={
                      classes["derivativesTableContainer__text--matchedRows"]
                    }
                  >
                    Total Charge
                  </div>
                  <div
                    className={
                      classes["derivativesTableContainer__text--matchedRows"]
                    }
                    style={{ color: "#238d38" }}
                  >
                    Match Count
                  </div>
                  <div
                    className={
                      classes["derivativesTableContainer__text--matchedRows"]
                    }
                    style={{ color: "#238d38" }}
                  >
                    Matched Sum Charge
                  </div>
                  <div
                    className={
                      classes["derivativesTableContainer__text--matchedRows"]
                    }
                    style={{ color: "#e59813" }}
                  >
                    Unmatched Count
                  </div>
                  <div
                    className={
                      classes["derivativesTableContainer__text--matchedRows"]
                    }
                    style={{ color: "#e59813" }}
                  >
                    Unmatched Group Count
                  </div>
                  <div
                    className={
                      classes["derivativesTableContainer__text--matchedRows"]
                    }
                    style={{ color: "#e59813" }}
                  >
                    Unmatched Sum Charge
                  </div>
                  <div
                    className={
                      classes["derivativesTableContainer__text--matchedRows"]
                    }
                    style={{ color: "#e59813" }}
                  >
                    Unmatch Charge Percentage
                  </div>
                </div>
                <div className={classes["derivativesTableContainer__data"]}>
                  <div
                    className={
                      classes["derivativesTableContainer__data--number"]
                    }
                  >
                    {!props.derivativeState?.fileName
                      ? "-"
                      : props.derivativeState.fileName}
                  </div>
                  <div
                    className={
                      classes["derivativesTableContainer__data--number"]
                    }
                  >
                    {!props.derivativeState?.totalCount
                      ? "0"
                      : props.derivativeState.totalCount}
                  </div>
                  <div
                    className={
                      classes["derivativesTableContainer__data--number"]
                    }
                  >
                    {!props.derivativeState?.totalCharge
                      ? "0"
                      : props.derivativeState.totalCharge}
                  </div>
                  <div
                    className={
                      classes["derivativesTableContainer__data--number"]
                    }
                    style={{ color: "#238d38" }}
                  >
                    {!props.derivativeState?.matchedCount
                      ? "0"
                      : props.derivativeState.matchedCount}
                  </div>
                  <div
                    className={
                      classes["derivativesTableContainer__data--number"]
                    }
                    style={{ color: "#238d38" }}
                  >
                    {!props.derivativeState?.matchSumCharge
                      ? "0"
                      : props.derivativeState.matchSumCharge}
                  </div>
                  <div
                    className={
                      classes["derivativesTableContainer__data--number"]
                    }
                    style={{ color: "#e59813" }}
                  >
                    {!props.derivativeState?.unmatchedCount
                      ? "0"
                      : props.derivativeState.unmatchedCount}
                  </div>
                  <div
                    className={
                      classes["derivativesTableContainer__data--number"]
                    }
                    style={{ color: "#e59813" }}
                  >
                    {!props.derivativeState?.unmatchedGroupCount
                      ? "0"
                      : props.derivativeState.unmatchedGroupCount}
                  </div>
                  <div
                    className={
                      classes["derivativesTableContainer__data--number"]
                    }
                    style={{ color: "#e59813" }}
                  >
                    {!props.derivativeState?.unmatchedSumCharge
                      ? "0"
                      : props.derivativeState.unmatchedSumCharge}
                  </div>
                  <div
                    className={
                      classes["derivativesTableContainer__data--number"]
                    }
                    style={{ color: "#e59813" }}
                  >
                    {!props.derivativeState?.unmatchedSumPercentage
                      ? "0"
                      : `${props.derivativeState.unmatchedSumPercentage}%`}
                  </div>
                </div>
              </div>
              <div className={classes["derivativesTableContainer__calculator"]}>
                <div
                  className={
                    classes["derivativesTableContainer__calculator--percentage"]
                  }
                >
                  {!props.spinnerState ? (
                    <React.Fragment>
                      <div style={{ marginLeft: 56 }}>
                        {!props.derivativeState?.matchedSumPercentage
                          ? "-"
                          : +props.derivativeState.matchedSumPercentage + "%"}
                      </div>
                      <div
                        className={
                          classes["derivativesTableContainer__calculator--text"]
                        }
                      >
                        {!props.completeState ? "Complete" : "Completed"}
                      </div>
                    </React.Fragment>
                  ) : (
                    <div className={classes["uploadFilesSpinnerContainer"]}>
                      <CircularProgress
                        style={{ color: "#3E2F72", marginTop: 15 }}
                        size={60}
                      />
                      <div
                        className={
                          classes["derivativesTableContainer__calculator--text"]
                        }
                      >
                        Processing
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={classes["downloadFileContainer"]}>
            <div className={classes["downloadFileContainer__headers"]}>
              <span
                className={classes["downloadFileContainer__headers--header"]}
              >
                3. Download File
              </span>
              <span
                className={classes["downloadFileContainer__headers--content"]}
              >
                File with Unresolved Derivatives is attached here
              </span>
            </div>
            <div className={classes["downloadFileContainer__box"]}>
              {!props.derivativeState?.unresolved ? (
                <span className={classes["downloadFileContainer__box--text"]}>
                  <Svg
                    className={classes["downloadFileContainer__box--text__svg"]}
                    name="attach"
                  />
                  <span style={{ fontWeight: 600 }}>unresolved.drv</span>
                </span>
              ) : (
                <div className={classes["downloadFileContainer__box--link"]}>
                  <Svg name="attach" />
                  <button
                    className={classes["downloadButton"]}
                    onClick={() =>
                      props.onDownload(props.derivativeState!.unresolved)
                    }
                  >
                    {props.derivativeState?.unresolved}
                  </button>
                </div>
              )}

              {!props.derivativeState?.unresolved ? (
                <Svg
                  className={classes["downloadFileContainer__box--download"]}
                  name="download"
                />
              ) : (
                <button
                  className={classes["downloadButton"]}
                  onClick={() =>
                    props.onDownload(props.derivativeState!.unresolved)
                  }
                >
                  <Svg
                    className={classes["downloadFileContainer__box--download"]}
                    name="download"
                  />
                </button>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

DerivativesView.displayName = "DerivativesView";
DerivativesView.defaultProps = {};

export default DerivativesView;
