import { RadioGroup } from "@medusajs/ui"

export default function RadioGroupChoiceBox() {
  return (
    <RadioGroup defaultValue="option1">
      <RadioGroup.ChoiceBox
        value="option1"
        label="Option 1"
        description="This is the first option."
      />
      <RadioGroup.ChoiceBox
        value="option2"
        label="Option 2"
        description="This is the second option."
      />
      <RadioGroup.ChoiceBox
        value="option3"
        label="Option 3"
        description="This is the third option."
      />
    </RadioGroup>
  )
}
