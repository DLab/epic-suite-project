// eslint-disable-next-line @typescript-eslint/no-unused-vars
import EventSourceConnection from "components/simulator/EventSourceConnection";
import Simulator from "components/simulator/index";
import ControlPanelContext from "context/ControlPanelContext";
import DataFitContext from "context/DataFitContext";
import GraphicsContext from "context/GraphicsContext";
import HardSimulationContext from "context/HardSimulationsStatus";
import MobilityMatrixContext from "context/MobilityMatrixContext";
import NewModelsContext from "context/NewModelsContext";
import SelectFeatureContext from "context/SelectFeaturesContext";
import SimulationContext from "context/SimulationContext";

const Home = () => {
    return (
        <SimulationContext>
            <NewModelsContext>
                <ControlPanelContext>
                    <SelectFeatureContext>
                        <MobilityMatrixContext>
                            <GraphicsContext>
                                <DataFitContext>
                                    <HardSimulationContext>
                                        <Simulator />
                                    </HardSimulationContext>
                                    {/* <EventSourceConnection /> */}
                                </DataFitContext>
                            </GraphicsContext>
                        </MobilityMatrixContext>
                    </SelectFeatureContext>
                </ControlPanelContext>
            </NewModelsContext>
        </SimulationContext>
    );
};

export default Home;
