export default {};
// import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
// import { IconButton, useToast } from "@chakra-ui/react";
// import { useContext } from "react";

// import { ControlPanel } from "context/ControlPanelContext";
// // import { ModelsSaved } from "context/ModelsContext";
// import { Model } from "types/ControlPanelTypes";
// import { DataParameters, ModelAttributes } from "types/ModelsTypes";
// import createIdComponent from "utils/createIdcomponent";

// interface Props {
//     closeUpdatingModel: (values: boolean) => void;
//     isEditing: boolean;
// }

// const ToastMessage = ({ closeUpdatingModel, isEditing }: Props) => {
//     const toast = useToast();
//     const { setParameters } = useContext(ModelsSaved);
//     const { parameters, mode, setMode, idModelUpdate, setIdModelUpdate } =
//         useContext(ControlPanel);
//     const handleDataLocalStorage = () => {
//         const bottomLeft = "bottom-left";
//         try {
//             const dataParameters: DataParameters = {
//                 parameters,
//                 id: Date.now(),
//             };
//             const dataModelsCreated: ModelAttributes["parameters"] = JSON.parse(
//                 localStorage.getItem("models")
//             );
//             if (mode === Model.Update) {
//                 const updateDataParameters: DataParameters = {
//                     parameters,
//                     id: idModelUpdate,
//                 };
//                 const indexDataToUpdate = dataModelsCreated.findIndex(
//                     (e: DataParameters) => e.id === idModelUpdate
//                 );
//                 dataModelsCreated[indexDataToUpdate] = updateDataParameters;
//                 localStorage.setItem(
//                     "models",
//                     JSON.stringify(dataModelsCreated)
//                 );
//                 setParameters({
//                     type: "update",
//                     element: `${idModelUpdate}`,
//                     payload: dataModelsCreated[indexDataToUpdate],
//                 });
//                 setIdModelUpdate(0);
//                 toast({
//                     position: bottomLeft,
//                     title: "Model Edited",
//                     description: "Your model was updated successfully",
//                     status: "success",
//                     duration: 2000,
//                     isClosable: true,
//                 });
//                 setMode(Model.Add);
//             } else {
//                 localStorage.setItem(
//                     "models",
//                     JSON.stringify([...dataModelsCreated, dataParameters])
//                 );
//                 setParameters({
//                     type: "add",
//                     payload: dataParameters,
//                 });
//                 setIdModelUpdate(0);
//                 toast({
//                     position: bottomLeft,
//                     title: "Model Created",
//                     description: "Your model was created successfully",
//                     status: "success",
//                     duration: 2000,
//                     isClosable: true,
//                 });
//             }
//         } catch (error) {
//             setIdModelUpdate(0);
//             toast({
//                 position: bottomLeft,
//                 title: "Error",
//                 description: error.message,
//                 status: "error",
//                 duration: 2000,
//                 isClosable: true,
//             });
//         }
//     };
//     return (
//         <>
//             {/* {mode === Model.Add && (
//         <Button
//           onClick={() => handleDataLocalStorage()}
//           colorScheme="teal"
//           size="md"
//           mt="20px"
//         >
//           Add Model
//         </Button>
//       )} */}
//             {mode === Model.Update && isEditing && (
//                 <>
//                     <IconButton
//                         id={createIdComponent()}
//                         color="#ffffff"
//                         aria-label="Call Segun"
//                         size="sm"
//                         cursor="pointer"
//                         bgGradient="linear(to-r, teal.500, green.500)"
//                         _hover={{
//                             bgGradient: "linear(to-r, teal.800, green.800)",
//                         }}
//                         icon={<CheckIcon />}
//                         onClick={() => {
//                             handleDataLocalStorage();
//                             closeUpdatingModel(false);
//                         }}
//                     />
//                     <IconButton
//                         id={createIdComponent()}
//                         color="#ffffff"
//                         aria-label="Call Segun"
//                         size="sm"
//                         cursor="pointer"
//                         bgGradient="linear(to-r, red.500, pink.500)"
//                         _hover={{
//                             bgGradient: "linear(to-r, red.800, pink.800)",
//                         }}
//                         icon={<CloseIcon />}
//                         onClick={() => {
//                             setMode(Model.Add);
//                             setIdModelUpdate(0);
//                             closeUpdatingModel(false);
//                         }}
//                     />
//                 </>
//             )}
//         </>
//     );
// };

// export default ToastMessage;
