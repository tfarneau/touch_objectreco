export default class InterfaceSetup{

	constructor(){

		this.stages = [
			{
				title: "Étape 1",
				id: "step1",
				buttons: [
					{
						title: "button 1",
						childs: [
							{
								title: "sub1"
							},
							{
								title: "sub2"
							},
							{
								title: "sub3"
							}
						]
					},
					{
						title: "button 2",
						childs: [
							{
								title: "sub1"
							},
							{
								title: "sub2"
							},
							{
								title: "sub3"
							},
							{
								title: "sub4"
							}
						]
					},
					{
						title: "button 3"
					},
					{
						title: "button 4"
					}
				]
			}
		];

	}

	get_stages(){
		return this.stages;
	}

	get_stage(id){

	}

}
