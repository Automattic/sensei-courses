const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { withAPIData } = wp.components;

import { find, get } from 'lodash';

registerBlockType( 'sensei/courses', {
	title: 'Courses',
	icon: 'book-alt',
	category: 'widgets',
	attributes: {
		exclude: { type: 'string' },
		ids: { type: 'string' },
		number: { type: 'number' },
	},

	edit: withAPIData( props => {
		const ids = get( props, [ 'attributes', 'ids' ] );

		return {
			courses: `/wp/v2/courses?_embed${ ids ? '&include=' + ids: '' }`,
			categories: '/wp/v2/course-category',
		};
	} )( props => {
		const courses = get( props, [ 'courses', 'data' ], [] );
		const allCategories = get( props, [ 'categories', 'data' ], [] );

		const onChange = field => event => props.setAttributes( { [ field ]: event.target.value } );

		return (
			<div>
				<form>
					<input
						onChange={ onChange( 'ids' ) }
						placeholder="Course ID(s), comma-separated"
						type="text"
						value={ props.attributes.ids } />
				</form>

				{ courses &&
					<div id="main">
						<ul class="course-container">
							{ courses.map( ( { 'course-category': courseCategories, _embedded: embedded, excerpt, link, title  } ) => (
								<li class="course">
									<section class="course-content">
										<section class="entry">

											{ get( title, 'rendered' ) &&
												<h3 class="course-title">
													<a href={ link }>
														{ title.rendered }
													</a>
												</h3>
											}

											<p class="sensei-course-meta">

												{ get( embedded, [ 'author', '0' ] ) &&
													<span class="course-author">
														{ __( 'by' ) }&nbsp;
														<a
															href={ get( embedded, [ 'author', '0', 'link' ] ) }
															title={ get( embedded, [ 'author', '0', 'name' ] ) }>
															{ get( embedded, [ 'author', '0', 'name' ] ) }
														</a>
													</span>
												}

												{ courseCategories && courseCategories.length > 0 &&
													<span class="course-category">
														{ __( 'in' ) }&nbsp;
														{ courseCategories.map( ( id, index ) => {
															const category = find( allCategories, { 'id': id } );

															return (
																<span>
																	<a
																		href={ get( category, 'link', '' ) }
																		rel="tag">
																		{ get( category, 'name', '' ) }
																	</a>
																	{ ( courseCategories.length - 1 === index ) ? '' : ', ' }
																</span>
															);
														} ) }
													</span>
												}

											</p>

											{ get( excerpt, 'rendered' ) &&
												<p class="course-excerpt"
													dangerouslySetInnerHTML={ { __html: excerpt.rendered } }>
												</p>
											}

										</section>
									</section>
								</li>
							) ) }
						</ul>
					</div>
				}
			</div>
		);
	} ),

	save: () => {
		return null;
	}
} );
