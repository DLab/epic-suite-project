import {
    TypeStrategy,
    PharmaceuticalSubStrategy,
    NonpharmaceuticalSubStrategy,
} from "types/InterventionsTypes";

const strategyFactory = {
    [TypeStrategy.Pharmaceutical]: {
        [PharmaceuticalSubStrategy.Vaccination]: {
            type: TypeStrategy.Pharmaceutical,
            subtype: {
                subtype: PharmaceuticalSubStrategy.Vaccination,
                config: {
                    start: 0,
                    end: 10,
                    details: {
                        vacEff: 0,
                        vacBeta: 0,
                    },
                },
            },
        },
    },
    [TypeStrategy.Nonpharmaceutical]: {
        [NonpharmaceuticalSubStrategy.LockDown]: {
            type: TypeStrategy.Nonpharmaceutical,
            subtype: {
                subtype: NonpharmaceuticalSubStrategy.LockDown,
                config: {
                    start: 0,
                    end: 10,
                    details: {
                        mobRed: 0,
                    },
                },
            },
        },
        [NonpharmaceuticalSubStrategy.CordonSanitaire]: {
            type: TypeStrategy.Nonpharmaceutical,
            subtype: {
                subtype: NonpharmaceuticalSubStrategy.CordonSanitaire,
                config: {
                    start: 0,
                    end: 10,
                    details: {
                        mobRed: 0,
                    },
                },
            },
        },
    },
};

export default strategyFactory;
