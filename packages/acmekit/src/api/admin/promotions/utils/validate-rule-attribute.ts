import { AcmeKitError } from "@acmekit/framework/utils"
import { getRuleAttributesMap } from "./rule-attributes-map"
import {
  ApplicationMethodTargetTypeValues,
  ApplicationMethodTypeValues,
  PromotionTypeValues,
  RuleTypeValues,
} from "@acmekit/types"

export function validateRuleAttribute(attributes: {
  promotionType: PromotionTypeValues | undefined
  ruleType: RuleTypeValues
  ruleAttributeId: string
  applicationMethodType?: ApplicationMethodTypeValues
  applicationMethodTargetType?: ApplicationMethodTargetTypeValues
}) {
  const {
    promotionType,
    ruleType,
    ruleAttributeId,
    applicationMethodType,
    applicationMethodTargetType,
  } = attributes

  const ruleAttributes =
    getRuleAttributesMap({
      promotionType,
      applicationMethodType,
      applicationMethodTargetType,
    })[ruleType] || []

  const ruleAttribute = ruleAttributes.find((obj) => obj.id === ruleAttributeId)

  if (!ruleAttribute) {
    throw new AcmeKitError(
      AcmeKitError.Types.INVALID_DATA,
      `Invalid rule attribute - ${ruleAttributeId}`
    )
  }
}
