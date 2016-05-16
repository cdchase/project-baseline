require 'spec_helper'
describe 'my_fw' do

  context 'with defaults for all parameters' do
    it { should contain_class('my_fw') }
  end
end
