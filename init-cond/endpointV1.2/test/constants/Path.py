from enum import Enum

class Path(Enum):
    INIT_COND = "/api/v0/initCond"
    REAL_DATA = "/api/v0/realData"
    METAPOPULATION_REAL_DATA = "/api/v0/realData?type=metapopulation"
    METAPOPULATION_INIT_COND = "/api/v0/initCond?type=metapopulation"
    INFO = "/api/v0/data/info"