import { FormattingOptionsType } from "types"

const acmekitOptions: FormattingOptionsType = {
  "^acmekit/": {
    maxLevel: 2,
  },
  "^acmekit/classes/acmekit\\.(Store*|Admin*)": {
    reflectionGroups: {
      Constructors: false,
    },
  },
}

export default acmekitOptions
