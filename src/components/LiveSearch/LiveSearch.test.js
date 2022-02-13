import React from 'react'
import renderer from 'react-test-renderer'
import { shallow, mount } from 'enzyme'
import LiveSearch from './LiveSearch'

const mockResponse = {
    "data": [
        {
            "type": "employees",
            "id": "323",
            "links": {
                "self": "http://localhost:3000/v1/employees/323"
            },
            "attributes": {
                "identifier": null,
                "firstName": "Harriet",
                "lastName": "McKinney",
                "name": "Harriet McKinney",
                "features": [
                    "engagement"
                ],
                "avatar": null,
                "employmentStart": "2016-01-31T00:00:00.000Z",
                "external": false,
                "Last Year Bonus": 3767,
                "Business Unit": "Sales",
                "Commute Time": 34,
                "Age": "1984-02-08",
                "Department": "Customer Care",
                "Gender": "Female",
                "Job Level": "Manager",
                "Local Office": "Kuala Lumpur",
                "% of target": 88,
                "Region": "APAC",
                "Salary": 76000,
                "Tenure": "2014-05-31"
            },
            "relationships": {
                "company": {
                    "data": {
                        "type": "companies",
                        "id": "5"
                    }
                },
                "account": {
                    "data": {
                        "type": "accounts",
                        "id": "324"
                    }
                },
                "phones": {
                    "data": []
                },
                "Manager": {
                    "data": {
                        "type": "employees",
                        "id": "201"
                    }
                }
            }
        },
        {
            "type": "employees",
            "id": "142",
            "links": {
                "self": "http://localhost:3000/v1/employees/142"
            },
            "attributes": {
                "identifier": null,
                "firstName": "Mathilda",
                "lastName": "Summers",
                "name": "Mathilda Summers",
                "features": [
                    "engagement"
                ],
                "avatar": null,
                "employmentStart": "2016-01-31T00:00:00.000Z",
                "external": false,
                "Last Year Bonus": 95050,
                "Business Unit": "Marketing",
                "Commute Time": 131,
                "Age": "1976-12-19",
                "Department": "Media",
                "Gender": "Female",
                "Job Level": "Executive",
                "Local Office": "London",
                "% of target": 166,
                "Region": "EMEA",
                "Salary": 248000,
                "Tenure": "2000-05-15"
            },
            "relationships": {
                "company": {
                    "data": {
                        "type": "companies",
                        "id": "5"
                    }
                },
                "account": {
                    "data": {
                        "type": "accounts",
                        "id": "143"
                    }
                },
                "phones": {
                    "data": []
                },
                "Manager": {
                    "data": {
                        "type": "employees",
                        "id": "139"
                    }
                }
            }
        },
    ],
    "included": [
        {
            "type": "accounts",
            "id": "143",
            "links": {
                "self": "http://localhost:3000/v1/accounts/143"
            },
            "attributes": {
                "email": "mathilda.summers@kinetar.com",
                "locale": null,
                "timezone": null,
                "bouncedAt": null,
                "bounceReason": null,
                "localeEffective": null,
                "timezoneEffective": null
            }
        },
        {
            "type": "accounts",
            "id": "324",
            "links": {
                "self": "http://localhost:3000/v1/accounts/324"
            },
            "attributes": {
                "email": "harriet.mckinney@kinetar.com",
                "locale": null,
                "timezone": null,
                "bouncedAt": null,
                "bounceReason": null,
                "localeEffective": null,
                "timezoneEffective": null
            }
        },
    ],
};

beforeAll(() => {
    global.fetch = jest.fn();
    //window.fetch = jest.fn(); if running browser environment
});


describe('LiveSearch component tests', () => {
    it('matches snapshot', () => {
        const component = renderer.create(
            <LiveSearch />,
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    describe('data is fetched on componentDidMount and state is updated', () => {
        it('fetches data from api', async () => {
            const wrapper = shallow(<LiveSearch />)
            const spyDidMount = jest.spyOn(LiveSearch.prototype, "componentDidMount");

            fetch.mockImplementation(() => {
                return Promise.resolve({
                    status: 200,
                    json: () => {
                        return mockResponse;
                    }
                });
            });

            const didMount = wrapper.instance().componentDidMount();
            expect(spyDidMount).toHaveBeenCalled();

            didMount.then(() => {
                // updating the wrapper
                wrapper.update();
                expect(wrapper.instance().state.toEqual({
                    managersList: [
                        {
                            name: 'Harriet McKinney',
                            email: 'harriet.mckinney@kinetar.com',
                            id: '323'
                        },
                        {
                            name: 'Mathilda Summers',
                            email: 'mathilda.summers@kinetar.com',
                            id: '142'
                        }
                    ],
                    showListMenu: false,
                    inputString: '',
                    filteredList: [
                        {
                            name: 'Harriet McKinney',
                            email: 'harriet.mckinney@kinetar.com',
                            id: '323'
                        },
                        {
                            name: 'Mathilda Summers',
                            email: 'mathilda.summers@kinetar.com',
                            id: '142'
                        }
                    ]
                }));

                spyDidMount.mockRestore();
                fetch.mockClear();
                done();
            });


        })

    })

    describe('test state update functions', () => {
        let wrapper;
        beforeAll(() => {
            wrapper = shallow(<LiveSearch />);
            wrapper.setState({
                managersList: [
                    {
                        name: 'Harriet McKinney',
                        email: 'harriet.mckinney@kinetar.com',
                        id: '323'
                    },
                    {
                        name: 'Mathilda Summers',
                        email: 'mathilda.summers@kinetar.com',
                        id: '142'
                    }
                ],
                showListMenu: false,
                inputString: '',
                filteredList: [
                    {
                        name: 'Harriet McKinney',
                        email: 'harriet.mckinney@kinetar.com',
                        id: '323'
                    },
                    {
                        name: 'Mathilda Summers',
                        email: 'mathilda.summers@kinetar.com',
                        id: '142'
                    }
                ]
            });
            wrapper.update();
        })

        it('onFocusHandler shows the dropdownList and onBlurHandler hides the dropdownList', () => {
            expect(wrapper.state("showListMenu")).toEqual(false);

            const onFocusHandlerSpy = jest.spyOn(wrapper.instance(), "onFocusHandler");
            const onBlurHandlerSpy = jest.spyOn(wrapper.instance(), "onBlurHandler");
            wrapper.instance().onFocusHandler();
            expect(onFocusHandlerSpy).toHaveBeenCalledTimes(1);
            expect(wrapper.state("showListMenu")).toEqual(true);

            jest.useFakeTimers();
            wrapper.instance().onBlurHandler();
            jest.advanceTimersByTime(1000);
            expect(onBlurHandlerSpy).toHaveBeenCalledTimes(1);
            expect(wrapper.state("showListMenu")).toEqual(false);
            jest.useRealTimers();

            onFocusHandlerSpy.mockReset();
            onFocusHandlerSpy.mockRestore();
            onBlurHandlerSpy.mockReset();
            onBlurHandlerSpy.mockRestore();

        })

        it('onClickHandler toggles the dropdownList', () => {
            expect(wrapper.state("showListMenu")).toEqual(false);

            const onClickHandlerSpy = jest.spyOn(wrapper.instance(), "onClickHandler");

            wrapper.instance().onClickHandler();
            expect(onClickHandlerSpy).toHaveBeenCalledTimes(1);
            expect(wrapper.state("showListMenu")).toEqual(true);

            wrapper.instance().onClickHandler();
            expect(onClickHandlerSpy).toHaveBeenCalledTimes(2);
            expect(wrapper.state("showListMenu")).toEqual(false);

            onClickHandlerSpy.mockReset();
            onClickHandlerSpy.mockRestore();

        });

        it('handleInputChange updates the input', () => {
            const handleInputChangeSpy = jest.spyOn(wrapper.instance(), "handleInputChange");
            wrapper.instance().handleInputChange({ target: { value: 'har' } });
            expect(handleInputChangeSpy).toHaveBeenCalledTimes(1);
            expect(wrapper.state("showListMenu")).toEqual(true);
            expect(wrapper.state("inputString")).toEqual('har');
            expect(wrapper.state("filteredList")).toEqual([
                {
                    name: 'Harriet McKinney',
                    email: 'harriet.mckinney@kinetar.com',
                    id: '323'
                }
            ]);

            handleInputChangeSpy.mockReset();
            handleInputChangeSpy.mockRestore();

        })

        it('handleListItemClick selects the list element', () => {
            const handleListItemClickSpy = jest.spyOn(wrapper.instance(), "handleListItemClick");

            wrapper.instance().handleListItemClick('142');
            expect(handleListItemClickSpy).toHaveBeenCalledTimes(1);
            expect(wrapper.state("showListMenu")).toEqual(false);
            expect(wrapper.state("inputString")).toEqual('Mathilda Summers');

            handleListItemClickSpy.mockReset();
            handleListItemClickSpy.mockRestore();

        })
        it('trigger click, mouseEnter and mouseLeave for a list item', () => {
            wrapper.find('#liveSearchInput').simulate('change', { target: { value: 'a' } });
            expect(wrapper.find('.liveSearch-list').exists()).toBeTruthy();

            expect(wrapper.find('.liveSearch-list-item').length).toBe(2);
            wrapper.find('.liveSearch-list-item').first().simulate('click', '323');

            wrapper.find('#liveSearchInput').simulate('change', { target: { value: '' } });
            wrapper.find('.liveSearch-list-item').first().simulate('mouseEnter', { target: { classList: { contains: jest.fn(), remove: jest.fn(), add: jest.fn() } } });
            wrapper.find('.liveSearch-list-item').first().simulate('mouseLeave', { target: { classList: { contains: jest.fn(), remove: jest.fn(), add: jest.fn() } } });

        });
    })
})




