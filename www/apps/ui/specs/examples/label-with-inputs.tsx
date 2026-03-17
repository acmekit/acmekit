import { Label, Input } from "@medusajs/ui"
import { Textarea, RadioGroup } from "@medusajs/ui"

export default function LabelWithInputs() {
  return (
    <form className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Label htmlFor="text-input">Text Input</Label>
        <Input id="text-input" placeholder="Enter text" />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="checkbox-input">Checkbox</Label>
        <Input id="checkbox-input" type="checkbox" />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="textarea-input">Textarea</Label>
        <Textarea
          id="textarea-input"
          placeholder="Enter details"
          className="border rounded p-2"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label>Radio Group</Label>
        <RadioGroup defaultValue="option-1" className="flex gap-4">
          <div className="flex items-center gap-1">
            <RadioGroup.Item id="radio-1" value="option-1" />
            <Label htmlFor="radio-1">Option 1</Label>
          </div>
          <div className="flex items-center gap-1">
            <RadioGroup.Item id="radio-2" value="option-2" />
            <Label htmlFor="radio-2">Option 2</Label>
          </div>
        </RadioGroup>
      </div>
    </form>
  )
}
